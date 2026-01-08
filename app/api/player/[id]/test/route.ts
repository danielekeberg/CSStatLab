import { NextRequest, NextResponse } from 'next/server';

type RouteContext = { params: Promise<{ id: string }> };

type FetchResult<T> = {
  ok: boolean;
  status: number;
  data: T | null;
  error?: string;
};

async function safeJsonFetch<T>(
  url: string,
  init?: RequestInit
): Promise<FetchResult<T>> {
  try {
    const res = await fetch(url, init);

    let json: any = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: null,
        error:
          (json && (json.error || json.message)) ||
          `Request failed (${res.status})`,
      };
    }

    return { ok: true, status: res.status, data: json as T };
  } catch (e: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: e?.message || 'Network error',
    };
  }
}

export async function GET(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  const STEAM_API_KEY = process.env.STEAM_API_KEY;
  const FACEIT_TOKEN = process.env.FACEIT_API_TOKEN;
  const LEETIFY_TOKEN = process.env.LEETIFY_API_KEY;

  if (!STEAM_API_KEY) {
    return NextResponse.json(
      { error: 'Missing STEAM_API_KEY' },
      { status: 500 }
    );
  }
  if (!FACEIT_TOKEN) {
    return NextResponse.json(
      { error: 'Missing FACEIT_API_TOKEN' },
      { status: 500 }
    );
  }

  const [leetifyProfile, leetifyMatches, steamProfile, faceitProfile] =
    await Promise.all([
      safeJsonFetch<any>(
        `https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${LEETIFY_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      ),
      safeJsonFetch<any>(
        `https://api-public.cs-prod.leetify.com/v3/profile/matches?steam64_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${LEETIFY_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      ),
      safeJsonFetch<any>(
        `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${id}`
      ),
      safeJsonFetch<any>(
        `https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${FACEIT_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      ),
    ]);

  const hasAnyData =
    leetifyProfile.ok ||
    leetifyMatches.ok ||
    steamProfile.ok ||
    faceitProfile.ok;

  const statusCode = hasAnyData ? 200 : 502;

  return NextResponse.json(
    {
      player: leetifyProfile.data,
      recentMatches: leetifyMatches.data,
      steam: steamProfile.data,
      faceit: faceitProfile.data,

      errors: {
        leetifyProfile: leetifyProfile.ok
          ? null
          : { status: leetifyProfile.status, message: leetifyProfile.error },
        leetifyMatches: leetifyMatches.ok
          ? null
          : { status: leetifyMatches.status, message: leetifyMatches.error },
        steam: steamProfile.ok
          ? null
          : { status: steamProfile.status, message: steamProfile.error },
        faceit: faceitProfile.ok
          ? null
          : { status: faceitProfile.status, message: faceitProfile.error },
      },

      flags: {
        hasLeetify: leetifyProfile.ok,
        hasSteam: steamProfile.ok,
        hasFaceit: faceitProfile.ok,
      },
    },
    { status: statusCode }
  );
}
