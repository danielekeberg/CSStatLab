interface PlayerStats {
  player: {
    rating: {
      aim: number;
      utility: number;
      ct_leetify: number;
      t_leetify: number;
      clutch: number;
    };
    stats: {
      trade_kills_success_percentage: number;
      traded_deaths_success_percentage: number;
      reaction_time_ms: number;
      flashbang_hit_friend_per_flashbang: number;
      he_friends_damage_avg: number;
      utility_on_death_avg: number;
      hs_percentage: number;
      t_opening_duel_success_percentage: number;
      ct_opening_duel_success_percentage: number;
      trade_kill_opportunities_per_round: number;
    };
  };
  recentMatches?: Array<{
    stats: Array<{
      kd_ratio: number;
    }>;
  }>;
}

interface Role {
  name: string;
  subRoles: string[];
}

function calculateAverageKD(stats: PlayerStats): number {
  if (!stats.recentMatches || stats.recentMatches.length === 0) {
    return 1.0;
  }

  const last30Matches = stats.recentMatches.slice(0, 30);
  const kdValues = last30Matches
    .filter((match) => match.stats && match.stats[0] && match.stats[0].kd_ratio)
    .map((match) => match.stats[0].kd_ratio);

  if (kdValues.length === 0) return 1.0;
  const sum = kdValues.reduce((acc, kd) => acc + kd, 0);
  return sum / kdValues.length;
}

function calculateDNA(stats: PlayerStats) {
  const normalize = (value: number, max: number) => Math.min(value / max, 1);

  const trade_score =
    stats?.player?.stats?.trade_kills_success_percentage * 0.4 +
    stats?.player?.stats?.traded_deaths_success_percentage * 0.4 +
    normalize(stats?.player?.stats?.trade_kill_opportunities_per_round, 0.5) *
      0.2;

  const anti_team_score =
    100 -
    stats?.player?.stats?.flashbang_hit_friend_per_flashbang * 80 -
    stats?.player?.stats?.he_friends_damage_avg * 10 -
    normalize(stats?.player?.stats?.utility_on_death_avg, 500) * 20;

  const opening_score =
    stats?.player?.stats?.ct_opening_duel_success_percentage * 0.25 +
    stats?.player?.stats?.t_opening_duel_success_percentage * 0.25;

  const t = stats?.player?.stats?.t_opening_duel_success_percentage ?? 0;
  const ct = stats?.player?.stats?.ct_opening_duel_success_percentage ?? 0;
  const raw = t * 0.65 + ct * 0.35;
  const normalized = Math.min(1, Math.max(0, (raw - 30) / (60 - 30)));
  const aggression = Math.round(Math.pow(normalized, 0.8) * 100);

  return {
    precision: stats?.player?.rating?.aim,
    aggression,
    utility: stats?.player?.rating?.utility,
    teamwork:
      trade_score * 0.4 +
      stats?.player?.rating?.utility * 0.3 +
      anti_team_score * 0.2 +
      opening_score * 0.1,
  };
}

export function assignRole(stats: PlayerStats): Role {
  const dna = calculateDNA(stats);
  const scores: { [key: string]: number } = {};
  const kdRatio = calculateAverageKD(stats);

  scores.starFragger =
    dna.precision * 0.35 +
    dna.aggression * 0.25 +
    (stats?.player?.stats?.t_opening_duel_success_percentage || 50) * 0.25 +
    Math.min(100, kdRatio * 50) * 0.15;

  scores.lurker =
    dna.precision * 0.25 +
    (100 - dna.aggression) * 0.25 +
    (stats?.player?.stats?.reaction_time_ms
      ? Math.max(0, 100 - stats?.player?.stats?.reaction_time_ms / 10)
      : 50) *
      0.2 +
    Math.min(100, kdRatio * 50) * 0.3;

  scores.support =
    dna.utility * 0.4 + dna.teamwork * 0.4 + (100 - dna.aggression) * 0.2;

  scores.clutchPlayer =
    dna.precision * 0.3 +
    (stats?.player?.rating?.clutch * 100 || 0) * 0.4 +
    Math.min(100, kdRatio * 50) * 0.3;

  scores.entryFragger =
    dna.aggression * 0.35 +
    (stats?.player?.stats?.t_opening_duel_success_percentage || 50) * 0.35 +
    dna.precision * 0.25;

  scores.tactical =
    dna.utility * 0.35 +
    dna.teamwork * 0.35 +
    (100 - dna.aggression) * 0.2 +
    (stats?.player?.rating?.ct_leetify * 100 +
      stats?.player?.rating?.ct_leetify * 100 || 50) *
      0.1;

  const highestRole = Object.entries(scores).reduce((a, b) =>
    scores[a[0]] > scores[b[0]] ? a : b
  );
  const roleName = highestRole[0];

  return getRoleWithSubRoles(roleName, stats, dna);
}

function getRoleWithSubRoles(
  roleName: string,
  stats: PlayerStats,
  dna: any
): Role {
  const subRoles: string[] = [];
  const kdRatio = calculateAverageKD(stats);
  const subRoleChecks = {
    'High Impact':
      stats?.player?.rating?.t_leetify * 100 +
        stats?.player?.rating?.ct_leetify * 100 >
      5,
    'Carry Potential': kdRatio > 1.5,
    'Mechanical Peak': dna?.precision > 90,
    'Opening Specialist':
      (stats?.player?.stats?.t_opening_duel_success_percentage || 0) > 50,
    'Trade Master':
      (stats?.player?.stats?.trade_kills_success_percentage || 0) > 60,
    'Clutch King': (stats?.player?.rating?.clutch * 100 || 0) > 25,
    'Utility Expert': dna?.utility > 70,
    'Team Player': dna?.teamwork > 65,
    'Headshot Machine': (stats?.player?.stats?.hs_percentage || 0) > 50,
    'Aggressive Entry': dna?.aggression > 75,
    'Patient Lurker': dna?.aggression < 40,
  };

  const availableSubRoles = Object.entries(subRoleChecks)
    .filter(([_, condition]) => condition)
    .map(([name, _]) => name);
  const finalSubRoles = [...new Set([...availableSubRoles])].slice(0, 3);

  const roleNames: { [key: string]: string } = {
    starFragger: 'STAR FRAGGER',
    lurker: 'LURKER',
    support: 'SUPPORT',
    clutchPlayer: 'CLUTCH PLAYER',
    entryFragger: 'ENTRY FRAGGER',
    tactical: 'TACTICAL MIND',
  };

  return {
    name: roleNames[roleName] || 'VERSATILE PLAYER',
    subRoles: finalSubRoles,
  };
}
