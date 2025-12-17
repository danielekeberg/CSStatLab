"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Loader from "@/app/components/Loader";
import PlayerOverview from "@/app/components/NewPlayerOverview";
import PlayerCard from "@/app/components/NewPlayerCard";
import PerformanceChart from "@/app/components/PerformanceChart";
import RecentMatches from "@/app/components/RecentMatches";
import Ranks from "@/app/components/Ranks";
import RecentWins from "@/app/components/RecentWins";

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

export default function PlayerPage() {
    const params = useParams<{ id: string }>()
    const steam64 = params.id;

    const [loading, setLoading] = useState(true);
    const [player, setPlayer] = useState<Player | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [matchesLength, setMatchesLength] = useState(0)
    const [recentMatchStats, setRecentMatchStats] = useState<any[]>([]);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if(!steam64) return;
        async function load() {
            try {
                setLoading(true);
                const sync = await fetch(`/api/player/${steam64}/sync`, {
                    method: "POST",
                });
                const syncRes = await sync.json();
                if(syncRes.error === "Failed to fetch Leetify profile") {
                    setMessage(syncRes.details);
                    setError(true);
                    setLoading(false);
                }
                const res = await fetch(`/api/player/${steam64}/data`, {
                    method: "GET",
                });
                if(!res.ok) {
                    console.error("Failed to load player data", await res.text());
                    setError(true);
                    setLoading(false);
                    return;
                }
                const data: ApiPlayerData = await res.json();
                setRecentMatchStats(data.recentMatchStats);
                setPlayer(data.player)
                setStats(data.stats)
                setMatchesLength(data.recentMatchStats.length)
            }   catch(err) {
                    console.error(err);
            }   finally {
                    setLoading(false);
            }
        }
        load()
    }, [steam64])

    if (loading) {
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
          <div className="relative"><div className="px-5 md:px-[15%]">
          <Header status={false} />
          <div className="h-[70vh] flex items-center justify-center">
            <div className="flex flex-col gap-5">
              <Loader />
              <p className="text-sm">{message || "Fetching player data..."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

if (!player) {
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
      <div className="relative"></div>
      <div className="px-5 md:px-[15%]">
        <Header status={false} />
        <div className="h-[70vh] flex items-center justify-center">
          <p className="text-sm text-white/60">No player data available.</p>
        </div>
      </div>
    </div>
  );
}

  return(
      <div className="relative min-h-screen overflow-hidden bg-[#030914] text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#040b1a] via-[#020814] to-[#030914]" />

      <div className="absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.55)_70%,rgba(0,0,0,0.85)_100%)]" />

      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:60px_60px]" />
      <div className="relative px-5 md:px-[15%]">
        <div className="relative">
          <Header status={true} />
            <div className="flex flex-col min-h-[73vh] gap-5 mb-20">
              <PlayerCard player={player}/>
              <div className="w-full">
                <PlayerOverview player={player} stats={stats} matches={matchesLength} matchRows={recentMatchStats} />
                {player.leetify_raw ? 
                <>
                  <PerformanceChart rows={recentMatchStats} />
                  <Ranks player={player} />
                  <RecentMatches matches={recentMatchStats} />
                </>
                :
                null
              }
              </div>
            </div>
          <Footer />
        </div>
      </div>
    </div>
  )
}