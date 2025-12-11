"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Header from "@/app/components/Header";
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

type DailyStat = {
    date: string;
    avg_rating: number;
};

type ApiPlayerData = {
    player: Player | null;
    chartData: { date: string; now: number; last: number | null }[];
    matches: any[];
};

export default function PlayerPage() {
    const params = useParams<{ id: string }>()
    const steam64 = params.id;

    const [loading, setLoading] = useState(true);
    const [player, setPlayer] = useState<Player | null>(null);
    const [dailyStats, setDailyStats] = useState<DailyStat[] | null>(null);
    const [matches, setMatches] = useState<any[]>([]);

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
                setPlayer(data.player)
                setDailyStats(
                    data.chartData.map((row) => ({
                        date: row.date,
                        avg_rating: row.now,
                    }))
                );
                setMatches(data.matches);
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
                <Header />
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
            <Header />

            <div className="flex flex-col md:flex-row gap-5">
                <div className="w-80">
                    <PlayerCard player={player}/>
                </div>
                <div className="w-full">
                    <PlayerOverview player={player} matches={matches} />
                </div>
            </div>
            

            <div className="my-10">
                {/* <PerformanceChart data={dailyStats ?? []} /> */}
            </div>
        </div>
    )
}