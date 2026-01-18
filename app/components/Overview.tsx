import { Activity, BarChart3 } from 'lucide-react';
import Header from './NewHeader';
import { CopyStatsButton } from './CopyStats';
import { assignRole } from './Role';

function normalize(value: number, max: number) {
  return Math.min(value / max, 1);
}

function calculateDNA(stats: any) {
  const normalize = (value: number, max: number) => Math.min(value / max, 1);

  const spread = (value: number, min: number, max: number) => {
    const clamped = Math.max(min, Math.min(max, value));
    return ((clamped - min) / (max - min)) * 100;
  };

  const trade_score =
    spread(stats.stats.trade_kills_success_percentage, 20, 70) * 0.4 +
    spread(stats.stats.traded_deaths_success_percentage, 20, 70) * 0.4 +
    normalize(stats.stats.trade_kill_opportunities_per_round, 0.5) * 100 * 0.2;

  const flash_penalty = Math.min(
    100,
    stats.stats.flashbang_hit_friend_per_flashbang * 120
  );
  const he_penalty = Math.min(100, stats.stats.he_friends_damage_avg * 30);
  const anti_team_damage = 100 - (flash_penalty * 0.6 + he_penalty * 0.4);

  const utility_impact =
    spread(stats.stats.flashbang_hit_foe_per_flashbang, 0.5, 1.2) * 0.4 +
    spread(stats.stats.flashbang_leading_to_kill || 0, 5, 20) * 0.3 +
    spread(stats.stats.flashbang_hit_foe_avg_duration, 1.5, 3.5) * 0.3;

  const utility_economy = spread(
    600 - stats.stats.utility_on_death_avg,
    0,
    450
  );

  const opening_score =
    stats.stats.ct_opening_duel_success_percentage * 0.25 +
    stats.stats.t_opening_duel_success_percentage * 0.25;

  const t = stats.stats.t_opening_duel_success_percentage ?? 0;
  const ct = stats.stats.ct_opening_duel_success_percentage ?? 0;
  const raw = t * 0.65 + ct * 0.35;
  const normalized = Math.min(1, Math.max(0, (raw - 30) / (60 - 30)));
  const aggression = Math.round(Math.pow(normalized, 0.8) * 100);

  console.log(stats);

  return {
    precision: stats.rating.aim,
    aggression,
    utility: stats.rating.utility,
    teamwork:
      trade_score * 0.35 +
      anti_team_damage * 0.25 +
      utility_impact * 0.25 +
      utility_economy * 0.15,
  };
}

export default function Overview(player: any) {
  const stats = player?.player?.player;

  const dnaColor = (input: any) => {
    if (input > 95) return 'bg-rose-500';
    if (input > 80) return 'bg-emerald-400';
    if (input > 60) return 'bg-[#07a4f1]';
    if (input > 40) return 'bg-zinc-400';
    return 'bg-orange-500';
  };

  const dna = calculateDNA(player?.player?.player);
  const role = assignRole(player.player);

  return (
    <div className="mb-10">
      <div className="md:flex items-center gap-10 mt-5">
        <div className="w-3/3">
          <div className="flex items-center gap-2">
            <div className="border border-zinc-500 p-1 rounded">
              <BarChart3 size={20} className="text-emerald-400" />
            </div>
            <p className="font-bold text-emerald-400 text-sm">
              CSSTATLAB ANALYTICAL ENGINE
            </p>
          </div>
          <h1 className="text-6xl my-5 font-bold tracking-tighter">
            {role.name}
          </h1>
          <div className="flex gap-2 items-center mb-2">
            {role.subRoles.map((label, i) => (
              <div
                key={i}
                className="bg-zinc-900 tracking-widest w-fit text-zinc-400 text-xs font-bold py-1 px-2 rounded border border-zinc-800 hover:border-emerald-500/20 transition-all hover:text-zinc-300 duration-200"
              >
                {label.toUpperCase()}
              </div>
            ))}
          </div>
          <CopyStatsButton
            id={player?.player?.steam?.response?.players?.[0].steamid}
            name={player?.player?.steam?.response?.players?.[0].personaname}
            aim={stats?.rating?.aim}
            preaim={stats?.stats.preaim}
            timeToDamageMs={stats?.stats.reaction_time_ms}
            headshotPct={stats?.stats.accuracy_head}
          />
        </div>
        <div className="bg-zinc-900 p-5 rounded-xl border my-10 md:my-0 border-zinc-800 md:w-1/3 space-y-3">
          <div className="flex items-center gap-2">
            <Activity size={15} className="text-emerald-400" />
            <p className="text-sm text-zinc-400 font-bold tracking-widest">
              STATISTICAL DNA
            </p>
          </div>
          <div className="space-y-3 tracking-wider text-zinc-500">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <p>AIM</p>
                <p>{dna?.precision?.toFixed(1)}</p>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-1 ${dnaColor(dna.precision)} rounded-full`}
                  style={{ width: `${dna.precision}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <p>AGGRESSION</p>
                <p>{dna?.aggression?.toFixed(1)}</p>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-1 ${dnaColor(dna.aggression)} rounded-full`}
                  style={{ width: `${dna.aggression}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <p>UTILITY</p>
                <p>{dna?.utility?.toFixed(1)}</p>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-1 ${dnaColor(dna.utility)} rounded-full`}
                  style={{ width: `${dna.utility}%` }}
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <p>TEAMWORK</p>
                <p>{dna.teamwork.toFixed(1)}</p>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-1 ${dnaColor(dna.teamwork)} rounded-full`}
                  style={{ width: `${dna.teamwork}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
