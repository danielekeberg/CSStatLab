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

    const profileRes = await fetch(`${LEETIFY_BASE}/v3/profile?steam64_id=${id}`);
    if (!profileRes.ok) {
      console.error(await profileRes.text());
      return NextResponse.json(
        { error: "Failed to fetch Leetify profile" },
        { status: 500 }
      );
    }

    const leetifyProfile = await profileRes.json();

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
    };

    const { error: upsertPlayerErr } = await supabase
      .from("players")
      .upsert(playerPayload, { onConflict: "id" });

    if (upsertPlayerErr) throw upsertPlayerErr;

    const recentMatches = leetifyProfile?.recent_matches ?? [];
    const matchesToUse = recentMatches.slice(0, 30);

    const matchIds = matchesToUse.map((m: any) => m.id);

    const { data: existingMatches, error: existingMatchesErr } = await supabase
      .from("matches")
      .select("id")
      .in("id", matchIds);

    if (existingMatchesErr) throw existingMatchesErr;

    const existingIds = new Set(existingMatches?.map((m) => m.id) ?? []);
    const newMatchIds = matchesToUse
      .filter((m: any) => !existingIds.has(m.id))
      .map((m: any) => m.id);

    const newMatchDetails: any[] = [];

    for (const matchId of newMatchIds) {
      const res = await fetch(`${LEETIFY_BASE}/v2/matches/${matchId}`);
      if (!res.ok) {
        console.warn("Failed to fetch match", matchId);
        continue;
      }
      const detail = await res.json();
      newMatchDetails.push(detail);
    }

    for (const match of newMatchDetails) {
      const matchRow = {
        id: match.id,
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

      const playerStats = match.stats?.find(
        (p: any) => `${p.steam64_id}` === `${id}`
      );
      if (!playerStats) continue;

      const statsRow = {
        match_id: match.id,
        player_id: id,
        leetify_rating: playerStats.leetify_rating,
        kd_ratio: playerStats.kd_ratio,
        accuracy: playerStats.accuracy,
        dpr: playerStats.dpr,
        preaim: playerStats.preaim ?? null,
        reaction_time_ms: playerStats.reaction_time ?? null,
      };

      const { error: insertStatsErr } = await supabase
        .from("player_match_stats")
        .insert(statsRow);

      if (insertStatsErr) {
        console.error("insertStatsErr", insertStatsErr);
      }
    }

    return NextResponse.json({ status: "ok", newMatches: newMatchIds.length });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { error: "Sync failed", details: err.message },
      { status: 500 }
    );
  }
}
