// app/api/player/[id]/data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing id in URL" },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServerClient();

  try {
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (playerError && playerError.code !== "PGRST116") {
      console.error("Error loading player:", playerError);
      return NextResponse.json(
        { error: "Failed to load player" },
        { status: 500 }
      );
    }

    const since = new Date();
    since.setDate(since.getDate() - 30);

    const { data: matchStatsRows, error: matchStatsError } = await supabase
      .from("player_match_stats")
      .select(
        `
        match_id,
        finished_at,
        total_kills,
        total_deaths,
        preaim,
        reaction_time_ms,
        accuracy,
        accuracy_head,
        accuracy_enemy_spotted,
        shots_fired,
        shots_hit_foe,
        spray_accuracy,
        counter_strafing_shots_good_ratio,
        rounds_won,
        rounds_lost,
        dpr,
        leetify_rating,
        map_name,
        has_banned_player,
        mode,
        team_number,
        score
      `
      )
      .eq("player_id", id)
      .gte("finished_at", since.toISOString())
      .order("finished_at", { ascending: false });

    if (matchStatsError) {
      console.error("Error loading player_match_stats:", matchStatsError);
      return NextResponse.json(
        { error: "Failed to load player match stats" },
        { status: 500 }
      );
    }

    if (!matchStatsRows || matchStatsRows.length === 0) {
      return NextResponse.json({
        player: player ?? null,
        stats: {
          kd: 0,
          winrate: 0,
          preaim: 0,
          ttd: 0,
          accuracy: 0,
          matchesPlayed: 0,
          matchesWon: 0,
        },
        recentMatchStats: [],
      });
    }

    let totalKills = 0;
    let totalDeaths = 0;
    let preaimSum = 0;
    let preaimCount = 0;
    let ttdSum = 0;
    let ttdCount = 0;
    let accSum = 0;
    let accCount = 0;
    let matchesPlayed = 0;
    let matchesWon = 0;

    for (const row of matchStatsRows) {
      matchesPlayed++;

      if (typeof row.total_kills === "number") {
        totalKills += row.total_kills;
      }

      if (typeof row.total_deaths === "number") {
        totalDeaths += row.total_deaths;
      }

      if (typeof row.preaim === "number") {
        preaimSum += row.preaim;
        preaimCount++;
      }

      if (typeof row.reaction_time_ms === "number") {
        ttdSum += row.reaction_time_ms;
        ttdCount++;
      }

      if (typeof row.accuracy === "number") {
        accSum += row.accuracy;
        accCount++;
      }

      if (
        typeof row.rounds_won === "number" &&
        typeof row.rounds_lost === "number"
      ) {
        if (row.rounds_won > row.rounds_lost) {
          matchesWon++;
        }
      }
    }

    const kd = totalDeaths > 0 ? totalKills / totalDeaths : 0;
    const winrate =
      matchesPlayed > 0 ? (matchesWon / matchesPlayed) * 100 : 0;
    const preaim = preaimCount > 0 ? preaimSum / preaimCount : 0;
    const ttd = ttdCount > 0 ? ttdSum / ttdCount : 0; // ms
    const accuracy = accCount > 0 ? accSum / accCount : 0;

    const stats = {
      kd: Number(kd.toFixed(2)),
      winrate: Number(winrate.toFixed(1)),
      preaim: Number(preaim.toFixed(3)),
      ttd: Number(ttd.toFixed(1)),
      accuracy: Number(accuracy.toFixed(4)),
      matchesPlayed,
      matchesWon,
    };

    return NextResponse.json({
      player: player ?? null,
      stats,
      recentMatchStats: matchStatsRows,
    });
  } catch (err) {
    console.error("Unexpected error fetching data:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
