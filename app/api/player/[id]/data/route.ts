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
      .single();

    if (playerError && playerError.code !== "PGRST116") {
      console.error("Error loading player:", playerError);
      return NextResponse.json(
        { error: "Failed to load player" },
        { status: 500 }
      );
    }

    const { data: dailyRows, error: dailyError } = await supabase
      .from("daily_stats")
      .select("date, rating_avg")
      .eq("player_id", id)
      .order("date", { ascending: true })
      .limit(8);

    if (dailyError) {
      console.error("Error loading daily_stats:", dailyError);
      return NextResponse.json(
        { error: "Failed to load chart data" },
        { status: 500 }
      );
    }

    const chartData =
      dailyRows?.map((row) => ({
        date: row.date,
        now: row.rating_avg,
        last: null,
      })) ?? [];

    const { data: statRows, error: statError } = await supabase
      .from("player_match_stats")
      .select("match_id")
      .eq("player_id", id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (statError) {
      console.error("Error loading matches:", statError);
      return NextResponse.json(
        { error: "Failed to load matches" },
        { status: 500 }
      );
    }

    const matchIds = (statRows ?? []).map((s) => s.match_id);

    let matches: any[] = [];
    if (matchIds.length > 0) {
      const { data: matchRows, error: matchesError } = await supabase
        .from("matches")
        .select("*")
        .in("id", matchIds);

      if (matchesError) {
        console.error("Error loading matches:", matchesError);
        return NextResponse.json(
          { error: "Failed to load matches" },
          { status: 500 }
        );
      }
      matches = matchRows;
    }

    return NextResponse.json({
      player: player ?? null,
      chartData: statRows ?? null,
      matches: matches ?? null,
    });
  } catch (err) {
    console.error("Unexpected error fetching data:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
