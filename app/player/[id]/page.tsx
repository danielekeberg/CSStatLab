"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Snowfall from "react-snowfall";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Loader from "@/app/components/Loader";
import PlayerOverview from "@/app/components/NewPlayerOverview";
import PlayerCard from "@/app/components/NewPlayerCard";
import PerformanceChart from "@/app/components/PerformanceChart";
import RecentMatches from "@/app/components/RecentMatches";
import Ranks from "@/app/components/Ranks";
import Affiliate from "@/app/components/Affiliate";

type Player = {
  id: string;
  name: string;
  avatar: string | null;
  country: string | null;
  last_synced_at: string | null;
  leetify_raw: any[] | null;
};

type Stats = {
  accuracy: number;
  kd: number;
  matchesPlayed: number;
  matchesWon: number;
  preaim: number;
  ttd: number;
  winrate: number;
};

type ApiPlayerData = {
  player: Player | null;
  stats: Stats | null;
  recentMatchStats: any[];
  notification: any[];
};

function BackgroundShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030914] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#040b1a] via-[#020814] to-[#030914]" />
      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-3xl" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:60px_60px]" />
      <Snowfall />
      {children}
    </div>
  );
}

export default function PlayerPage() {
  const params = useParams<{ id: string }>();
  const steam64 = params.id;

  const [initialLoading, setInitialLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMatchStats, setRecentMatchStats] = useState<any[]>([]);
  const [matchesLength, setMatchesLength] = useState(0);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  async function fetchData(id: string, signal?: AbortSignal) {
    const res = await fetch(`/api/player/${id}/data`, {
      method: "GET",
      signal,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(`Failed to load player data: ${txt}`);
    }

    const data: ApiPlayerData = await res.json();
    return data;
  }

  async function runSync(id: string) {
    try {
      setIsSyncing(true);

      const sync = await fetch(`/api/player/${id}/sync`, { method: "POST" });
      const syncRes = await sync.json().catch(() => ({} as any));

      if (syncRes?.error === "Failed to fetch Leetify profile") {
        setMessage(syncRes?.details ?? "Failed to sync profile.");
        if (!player) setError(true);
        return;
      }

      const fresh = await fetchData(id);
      setRecentMatchStats(fresh.recentMatchStats);
      setPlayer(fresh.player);
      setStats(fresh.stats);
      setMatchesLength(fresh.recentMatchStats.length);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error(err);
      if (!player) {
        setError(true);
        setMessage(err?.message ?? "Failed to sync profile.");
      }
    } finally {
      setIsSyncing(false);
    }
  }

  useEffect(() => {
    if (!steam64) return;

    const controller = new AbortController();

    (async () => {
      try {
        setError(false);
        setMessage("");
        setInitialLoading(true);

        const data = await fetchData(steam64, controller.signal);

        setHasLoadedOnce(true);
        setRecentMatchStats(data.recentMatchStats);
        setPlayer(data.player);
        setStats(data.stats);
        setMatchesLength(data.recentMatchStats.length);
        if (!data.player) {
          await runSync(steam64);
        } else {
          const doSync = () => runSync(steam64);

          if (typeof (window as any).requestIdleCallback === "function") {
            (window as any).requestIdleCallback(doSync, { timeout: 1500 });
          } else {
            setTimeout(doSync, 250);
          }
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error(err);
        setError(true);
        setMessage(err?.message ?? "Failed to load player data.");
      } finally {
        setInitialLoading(false);
      }
    })();

    return () => controller.abort();
  }, [steam64]);

  if (initialLoading && !player) {
    return (
      <BackgroundShell>
        <div className="relative">
          <div className="px-5 md:px-[15%]">
            <Header status={false} />
            <div className="h-[70vh] flex items-center justify-center">
              <div className="flex flex-col gap-5 items-center">
                <Loader />
                <p className="text-sm">
                  {message || "Loading cached stats..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </BackgroundShell>
    );
  }

  if (!player) {
    const waitingForSync = !hasLoadedOnce || isSyncing;

    return (
      <BackgroundShell>
        <div className="relative px-5 md:px-[15%]">
          <Header status={false} />
          <div className="h-[70vh] flex items-center justify-center">
            {waitingForSync ? (
              <div className="flex flex-col items-center gap-4">
                <Loader />
                <p className="text-sm text-white/70">
                  Syncing profile… this can take a few seconds.
                </p>
                <p className="text-xs text-white/50">
                  We&apos;re fetching your latest matches and stats.
                </p>
              </div>
            ) : (
              <p className="text-sm text-white/60">
                {error
                  ? message || "No player data available."
                  : "No player data available yet. Try refreshing in a moment."}
              </p>
            )}
          </div>
        </div>
      </BackgroundShell>
    );
  }

  return (
    <BackgroundShell>
      <div className="relative px-5 md:px-[15%]">
        <div className="relative">
          <Header status={true} />

          <div className="flex flex-col min-h-[73vh] gap-5 mb-20">
            <PlayerCard player={player} />

            <div className="w-full">
              <PlayerOverview
                player={player}
                stats={stats}
                matches={matchesLength}
                matchRows={recentMatchStats}
              />
              {player.leetify_raw ? (
                <>
                  <PerformanceChart rows={recentMatchStats} />
                  <Affiliate />
                  <Ranks player={player} matches={recentMatchStats} />
                  <RecentMatches matches={recentMatchStats} />
                </>
              ) : null}
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </BackgroundShell>
  );
}
