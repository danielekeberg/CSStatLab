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
    const [recentMatchStats, setRecentMatchStats] = useState<any[]>([]);

    useEffect(() => {
        if(!steam64) return;
        async function load() {
            try {
                setLoading(true);
                await fetch(`/api/player/${steam64}/sync`, {
                    method: "POST",
                });
                const res = await fetch(`/api/player/${steam64}/data`, {
                    method: "GET",
                });
                if(!res.ok) {
                    console.error("Failed to load player data", await res.text());
                    return;
                }
                const data: ApiPlayerData = await res.json();
                console.log(data);
                setRecentMatchStats(data.recentMatchStats);
                setPlayer(data.player)
                setStats(data.stats)
            }   catch(err) {
                    console.error(err);
            }   finally {
                    setLoading(false);
            }
        }
        load()
    }, [steam64])

    if(loading || !player) {
        return (
            <div className="px-5 md:px-[15%]">
                <Header status={false} />
                <div className="h-[70vh] flex items-center justify-center">
                    <div className="flex flex-col gap-5">
                        <Loader />
                        <p className="text-sm">Fetching player data...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="px-5 md:px-[15%]">
            <Header status={true} />
            <div className="flex flex-col md:flex-row gap-5">
                <div className="w-80">
                    <PlayerCard player={player}/>
                </div>
                <div className="w-full">
                    <PlayerOverview player={player} stats={stats} />
                    <PerformanceChart rows={recentMatchStats} />
                    <RecentMatches matches={recentMatchStats} />
                </div>
            </div>
            <Footer />
        </div>
    )
}