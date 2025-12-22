import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const LEETIFY_BASE = "https://api-public.cs-prod.leetify.com";
const FACEIT_BASE = "https://open.faceit.com/data/v4";

const FACEIT_TOKEN = process.env.FACEIT_API_TOKEN;
const STEAM_API_KEY = process.env.STEAM_API_KEY;
const LEETIFY_API_KEY = process.env.LEETIFY_API_KEY as string;

type RouteContext = { params: Promise<{ id: string }> };

function minutesSince(dateIso?: string | null) {
  if (!dateIso) return Infinity;
  const last = new Date(dateIso);
  const now = new Date();
  return (now.getTime() - last.getTime()) / 1000 / 60;
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Fetch failed ${res.status} ${res.statusText}: ${txt}`);
  }
  return res.json();
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length) as any;
  let i = 0;

  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      const idx = i++;
      if (idx >= items.length) break;
      results[idx] = await worker(items[idx]);
    }
  });

  await Promise.all(runners);
  return results;
}

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = createSupabaseServerClient();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const { data: existingPlayer, error: playerErr } = await supabase
      .from("players")
      .select("id, last_synced_at, last_match_id, last_light_checked_at, last_profile_refreshed_at")
      .eq("id", id)
      .maybeSingle();

    if (playerErr) throw playerErr;

    const leetifyProfile = await fetchJson(
      `${LEETIFY_BASE}/v3/profile?steam64_id=${id}`,
      {
        headers: {
          _leetify_key: LEETIFY_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const recentMatches = leetifyProfile?.recent_matches ?? [];
    const latestMatch = recentMatches[0] ?? null;

    await supabase
      .from("players")
      .upsert(
        {
          id,
          last_light_checked_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (
      existingPlayer?.last_match_id &&
      latestMatch?.id &&
      existingPlayer.last_match_id === latestMatch.id
    ) {
      await supabase
        .from("players")
        .update({ last_synced_at: new Date().toISOString(), leetify_raw: leetifyProfile })
        .eq("id", id);

      return NextResponse.json({
        status: "ok",
        message: "No new matches (light check)",
        newMatches: 0,
        latestMatchId: latestMatch?.id ?? null,
      });
    }

    const diffMinutes = minutesSince(existingPlayer?.last_synced_at ?? null);
    const profileRefreshMinutes = minutesSince(existingPlayer?.last_profile_refreshed_at ?? null);
    const shouldRefreshExternalProfiles = !existingPlayer || profileRefreshMinutes > 24 * 60;

    let steamProfile: any = null;
    let faceitData: any = null;

    if (shouldRefreshExternalProfiles) {
      if (STEAM_API_KEY) {
        try {
          const steamJson = await fetchJson(
            `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${id}`
          );
          steamProfile = steamJson.response?.players?.[0] ?? null;
        } catch (err) {
          console.warn("Steam fetch failed:", err);
        }
      }

      if (FACEIT_TOKEN) {
        try {
          faceitData = await fetchJson(
            `${FACEIT_BASE}/players?game=cs2&game_player_id=${id}`,
            {
              headers: {
                Authorization: `Bearer ${FACEIT_TOKEN}`,
                "Content-Type": "application/json",
              },
            }
          );
        } catch (err) {
          console.warn("FACEIT fetch failed:", err);
        }
      }
    }

    const matchesToUse = recentMatches.slice(0, 30);
    const matchIds = matchesToUse.map((m: any) => m.id).filter(Boolean);

    if (!matchIds.length) {
      const playerPayload = {
        id,
        name: steamProfile?.personaname ?? null,
        avatar: steamProfile?.avatarfull ?? steamProfile?.avatarmedium ?? null,
        steam_url: steamProfile?.profileurl ?? null,
        country: faceitData?.country ? String(faceitData.country).toUpperCase() : null,
        leetify_raw: leetifyProfile ?? null,
        faceit_raw: faceitData ?? null,
        last_synced_at: new Date().toISOString(),
        last_profile_refreshed_at: shouldRefreshExternalProfiles ? new Date().toISOString() : existingPlayer?.last_profile_refreshed_at ?? null,
        last_match_id: latestMatch?.id ?? null,
      };

      const { error: upsertPlayerErr } = await supabase
        .from("players")
        .upsert(playerPayload, { onConflict: "id" });

      if (upsertPlayerErr) throw upsertPlayerErr;

      return NextResponse.json({ status: "ok", newMatches: 0 });
    }

    const { data: existingMatches, error: existingMatchesErr } = await supabase
      .from("matches")
      .select("match_id")
      .in("match_id", matchIds);

    if (existingMatchesErr) throw existingMatchesErr;

    const existingIds = new Set(existingMatches?.map((m: any) => m.match_id) ?? []);
    const newMatchIds = matchIds.filter((mid: string) => !existingIds.has(mid));

    if (newMatchIds.length === 0) {
      const playerPayload = {
        id,
        ...(shouldRefreshExternalProfiles
          ? {
              name: steamProfile?.personaname ?? null,
              avatar: steamProfile?.avatarfull ?? steamProfile?.avatarmedium ?? null,
              steam_url: steamProfile?.profileurl ?? null,
              country: faceitData?.country ? String(faceitData.country).toUpperCase() : null,
              faceit_raw: faceitData ?? null,
              last_profile_refreshed_at: new Date().toISOString(),
            }
          : {}),
        leetify_raw: leetifyProfile ?? null,
        last_synced_at: new Date().toISOString(),
        last_match_id: latestMatch?.id ?? null,
      };

      const { error: upsertPlayerErr } = await supabase
        .from("players")
        .upsert(playerPayload, { onConflict: "id" });

      if (upsertPlayerErr) throw upsertPlayerErr;

      return NextResponse.json({
        status: "ok",
        message: "No new matches (db check)",
        newMatches: 0,
      });
    }

    const matchDetails = await mapWithConcurrency(
      newMatchIds,
      4,
      async (matchId: string) => {
        try {
          const detail = await fetchJson(`${LEETIFY_BASE}/v2/matches/${matchId}`, {
            headers: {
              _leetify_key: LEETIFY_API_KEY,
              "Content-Type": "application/json",
            },
          });
          return detail;
        } catch (err) {
          console.warn("Failed to fetch match", matchId, err);
          return null;
        }
      }
    );

    const newMatchDetails = matchDetails.filter(Boolean) as any[];

    const matchRows = newMatchDetails.map((match) => ({
      match_id: match.id,
      map_name: match.map_name,
      finished_at: match.finished_at,
      team_scores: match.team_scores,
      raw: match,
    }));

    if (matchRows.length) {
      const { error: upsertMatchesErr } = await supabase
        .from("matches")
        .upsert(matchRows, { onConflict: "match_id" });
      if (upsertMatchesErr) {
        console.error("upsertMatchesErr", upsertMatchesErr);
      }
    }

    let totalKills = 0;
    let totalDeaths = 0;
    let matchesPlayed = 0;
    let matchesWon = 0;

    let preaimSum = 0;
    let preaimCount = 0;

    let ttdSumMs = 0;
    let ttdCount = 0;

    const statsRows: any[] = [];

    for (const match of newMatchDetails) {
      for (const p of match.stats ?? []) {
        const row = {
          match_id: match.id,
          map_name: match.map_name,
          mode: match.data_source,
          has_banned_player: match.has_banned_player,
          player_id: String(p.steam64_id),

          leetify_rating: p.leetify_rating ?? null,
          kd_ratio: p.kd_ratio ?? null,
          accuracy: p.accuracy ?? null,
          dpr: p.dpr ?? null,
          preaim: p.preaim ?? null,
          reaction_time_ms: typeof p.reaction_time === "number" ? p.reaction_time * 1000 : null,
          accuracy_enemy_spotted: p.accuracy_enemy_spotted ?? null,
          accuracy_head: p.accuracy_head ?? null,
          shots_fired: p.shots_fired ?? null,
          shots_hit_foe: p.shots_hit_foe ?? null,
          spray_accuracy: p.spray_accuracy ?? null,
          counter_strafing_shots_good_ratio: p.counter_strafing_shots_good_ratio ?? null,

          total_kills: p.total_kills ?? null,
          total_deaths: p.total_deaths ?? null,
          team_number: p.initial_team_number ?? null,
          score: p.score ?? null,

          finished_at: match.finished_at ?? null,
          rounds_won: p.rounds_won ?? null,
          rounds_lost: p.rounds_lost ?? null,
        };

        statsRows.push(row);

        if (`${p.steam64_id}` === `${id}`) {
          matchesPlayed++;

          if (typeof p.total_kills === "number") totalKills += p.total_kills;
          if (typeof p.total_deaths === "number") totalDeaths += p.total_deaths;

          if (typeof p.preaim === "number") {
            preaimSum += p.preaim;
            preaimCount++;
          }

          if (typeof p.reaction_time === "number") {
            ttdSumMs += p.reaction_time * 1000;
            ttdCount++;
          }

          const playerTeam = p.initial_team_number;
          const playerTeamScore = match.team_scores?.find(
            (t: any) => t.team_number === playerTeam
          );
          const otherTeamScore = match.team_scores?.find(
            (t: any) => t.team_number !== playerTeam
          );

          if (playerTeamScore && otherTeamScore) {
            if (playerTeamScore.score > otherTeamScore.score) {
              matchesWon++;
            }
          }
        }
      }
    }

    if (statsRows.length) {
      const { error: upsertStatsErr } = await supabase
        .from("player_match_stats")
        .upsert(statsRows, { onConflict: "match_id,player_id" });

      if (upsertStatsErr) {
        console.error("upsertStatsErr", upsertStatsErr);
      }
    }

    const kd = totalDeaths > 0 ? totalKills / totalDeaths : null;
    const winrate = matchesPlayed > 0 ? (matchesWon / matchesPlayed) * 100 : null;
    const preaim = preaimCount > 0 ? preaimSum / preaimCount : null;
    const ttd = ttdCount > 0 ? ttdSumMs / ttdCount : null;

    const statsSummary = {
      kd,
      winrate,
      preaim,
      ttd,
      matchesPlayed,
      matchesWon,
    };

    const playerPayload: any = {
      id,
      leetify_raw: leetifyProfile ?? null,
      last_synced_at: new Date().toISOString(),
      last_match_id: latestMatch?.id ?? null,
      stats: statsSummary,
    };

    if (shouldRefreshExternalProfiles) {
      playerPayload.name = steamProfile?.personaname ?? null;
      playerPayload.avatar = steamProfile?.avatarfull ?? steamProfile?.avatarmedium ?? null;
      playerPayload.steam_url = steamProfile?.profileurl ?? null;
      playerPayload.country = faceitData?.country ? String(faceitData.country).toUpperCase() : null;
      playerPayload.faceit_raw = faceitData ?? null;
      playerPayload.last_profile_refreshed_at = new Date().toISOString();
    }

    const { error: upsertPlayerErr } = await supabase
      .from("players")
      .upsert(playerPayload, { onConflict: "id" });

    if (upsertPlayerErr) throw upsertPlayerErr;

    return NextResponse.json({
      status: "ok",
      newMatches: newMatchIds.length,
      fetchedMatchDetails: newMatchDetails.length,
      diffMinutesSinceLastSync: diffMinutes,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Sync failed", details: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
