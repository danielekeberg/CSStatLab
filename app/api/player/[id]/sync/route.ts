// app/api/player/[id]/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const LEETIFY_BASE = "https://api-public.cs-prod.leetify.com";
const FACEIT_BASE = "https://open.faceit.com/data/v4";
const FACEIT_TOKEN = process.env.FACEIT_API_TOKEN;
const STEAM_API_KEY = process.env.STEAM_API_KEY;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const supabase = createSupabaseServerClient();

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  try {
    const { data: existingPlayer, error: playerErr } = await supabase
      .from("players")
      .select("id, last_synced_at")
      .eq("id", id)
      .maybeSingle();

    if (playerErr) throw playerErr;

    if (existingPlayer?.last_synced_at) {
      const last = new Date(existingPlayer.last_synced_at);
      const now = new Date();
      const diffMinutes = (now.getTime() - last.getTime()) / 1000 / 60;
      if (diffMinutes < 10) {
        return NextResponse.json({
          status: "ok",
          message: "Recently synced, skipping heavy fetch",
        });
      }
    }
    
    let steamProfile: any = null;
    if(STEAM_API_KEY) {
        try {
            const steamRes = await fetch(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${id}`);
            if(steamRes.ok) {
                const steamJson = await steamRes.json();
                steamProfile = steamJson.response?.players?.[0] ?? null;
            } else {
                console.warn("Failed to fetch Steam profile", await steamRes.text());
            }
        } catch(err) {
            console.error("Steam fetch failed:", err)
        }
    }
    const profileRes = await fetch(`${LEETIFY_BASE}/v3/profile?steam64_id=${id}`, {
      headers: {
        "_leetify_key": process.env.LEETIFY_API_KEY as string,
        "Content-Type": "application/json",
      }
    });
    if (!profileRes.ok) {
      console.error(await profileRes.text());
      return NextResponse.json(
        { error: "Failed to fetch Leetify profile" },
        { status: 500 }
      );
    }

    const leetifyProfile = await profileRes.json();

    const recentMatches = leetifyProfile?.recent_matches ?? [];
    const matchesToUse = recentMatches.slice(0, 30);
    let faceitData: any = null;
    if (FACEIT_TOKEN) {
      const faceitRes = await fetch(
        `${FACEIT_BASE}/players?game=cs2&game_player_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${FACEIT_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (faceitRes.ok) {
        faceitData = await faceitRes.json();
      }
    }
    const matchIds = matchesToUse.map((m: any) => m.id);

    const { data: existingMatches, error: existingMatchesErr } = await supabase
      .from("matches")
      .select("match_id")
      .in("match_id", matchIds);

    if (existingMatchesErr) throw existingMatchesErr;

    const existingIds = new Set(existingMatches?.map((m) => m.match_id) ?? []);
    const newMatchIds = matchesToUse
      .filter((m: any) => !existingIds.has(m.id))
      .map((m: any) => m.id);
    const newMatchDetails: any[] = [];

    for (const matchId of newMatchIds) {
      const res = await fetch(`${LEETIFY_BASE}/v2/matches/${matchId}`, {
        headers: {
        "_leetify_key": process.env.LEETIFY_API_KEY as string,
        "Content-Type": "application/json",
      }
      });
      if (!res.ok) {
        console.warn("Failed to fetch match", matchId);
        continue;
      }
      const detail = await res.json();
      newMatchDetails.push(detail);
    }

    let totalKills = 0;
    let totalDeaths = 0;

    let matchesPlayed = 0;
    let matchesWon = 0;

    let preaimSum = 0;
    let preaimCount = 0;

    let ttdSumMs = 0;
    let ttdCount = 0;
    for (const match of newMatchDetails) {
      const matchRow = {
        match_id: match.id,
        map_name: match.map_name,
        finished_at: match.finished_at,
        team_scores: match.team_scores,
        raw: match,
      };

      const { error: insertMatchErr } = await supabase
        .from("matches")
        .insert(matchRow)
        .single();

      if (insertMatchErr && insertMatchErr.code !== "23505") {
        console.error(insertMatchErr);
      }

      for (const p of match.stats ?? []) {
        const statsRow = {
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
          reaction_time_ms: p.reaction_time ? p.reaction_time * 1000 : null,
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

        const { error: insertStatsErr } = await supabase
          .from("player_match_stats")
          .upsert(statsRow, { onConflict: "match_id,player_id" });

        if (insertStatsErr) {
          console.error("insertStatsErr", insertStatsErr);
        }

    
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
          const playerTeamScore = match.team_scores?.find((t:any) => t.team_number === playerTeam);
          const otherTeamScore = match.team_scores?.find((t:any) => t.team_number !== playerTeam);

          if (playerTeamScore && otherTeamScore) {
            if (playerTeamScore.score > otherTeamScore.score) {
              matchesWon++;
            }
          }
        }
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

    const playerPayload = {
      id,
      name: leetifyProfile?.name ?? null,
      avatar: leetifyProfile?.avatarFull ??
              leetifyProfile?.avatar ??
              steamProfile?.avatarfull ??
              steamProfile?.avatarmedium ??
              null,
      steam_url: steamProfile.profileurl ?? null,
      country: faceitData?.country.toUpperCase() ?? null,
      leetify_raw: leetifyProfile,
      faceit_raw: faceitData,
      last_synced_at: new Date().toISOString(),
      stats: statsSummary
    };

    const { error: upsertPlayerErr } = await supabase
      .from("players")
      .upsert(playerPayload, { onConflict: "id" });

    if (upsertPlayerErr) throw upsertPlayerErr;

    return NextResponse.json({ status: "ok", newMatches: newMatchIds.length });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Sync failed", details: err.message },
      { status: 500 }
    );
  }
}
