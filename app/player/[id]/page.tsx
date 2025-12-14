"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Loader from "@/app/components/Loader";
import PlayerOverview from "@/app/components/PlayerOverview";
import PlayerCard from "@/app/components/PlayerCard";
import PerformanceChart from "@/app/components/PerformanceChart";
import RecentMatches from "@/app/components/RecentMatches";

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
    <div className="px-5 md:px-[15%]">
      <Header status={false} />
      <div className="h-[70vh] flex items-center justify-center">
        <div className="flex flex-col gap-5">
          <Loader />
          <p className="text-sm">{message || "Fetching player data..."}</p>
        </div>
      </div>
    </div>
  );
}

if (!player) {
  return (
    <div className="px-5 md:px-[15%]">
      <Header status={false} />
      <div className="h-[70vh] flex items-center justify-center">
        <p className="text-sm text-white/60">No player data available.</p>
      </div>
    </div>
  );
}

    return (
        <div className="px-5 md:px-[15%]">
            <Header status={true} />
            <div className="flex flex-col min-h-[73vh] md:flex-row gap-5">
                <div className="w-80">
                    <PlayerCard player={player}/>
                </div>
                <div className="w-full">
                    <PlayerOverview player={player} stats={stats} matches={matchesLength} matchRows={recentMatchStats} />
                    {player.leetify_raw ? 
                    <>
                        <PerformanceChart rows={recentMatchStats} />
                        <RecentMatches matches={recentMatchStats} />
                    </>
                    :
                    null}
                </div>
            </div>
            <Footer />
        </div>
    )
}