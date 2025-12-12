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
    matches: any[];
};

export default function PlayerPage() {
    const params = useParams<{ id: string }>()
    const steam64 = params.id;

    const [loading, setLoading] = useState(true);
    const [player, setPlayer] = useState<Player | null>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [input, setInput] = useState("");
    const [steamId, setSteamId] = useState("");

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
                setStats(data.stats)
            }   catch(err) {
                    console.error(err);
            }   finally {
                    setLoading(false);
            }
        }
        load()
    }, [steam64])

    function extractVanity(input:any) {
        try {
            if(input.startsWith("https://steamcommunity.com/profiles/")) {
            const p = new URL(input);
            const parts = p.pathname.split("/").filter(Boolean);
            window.location.href = `../player/${parts[1]}`;
            }
            if(!input.startsWith("https")) {
            return input.trim();
            }
            const u = new URL(input);
            const parts = u.pathname.split("/").filter(Boolean);
            if(parts[0] === "id" && parts[1]) {
            return parts[1];
            }

            if(parts[0] === "profiles" && parts[1]) {
            return parts[1];
            }

            return input.trim();
        } catch(err) {
            return input.trim();
        }
    }

    const handleResolve = async (e:any) => {
        e.preventDefault();
        setSteamId("");
        try {
        const vanity = extractVanity(input);
        const res = await fetch(`/api/steam/resolve?vanityurl=${encodeURIComponent(vanity)}`);
        const data = await res.json();
        if(!res.ok) {
            console.error(data.error || "Something went wrong")
        } else {
            window.location.href = `../player/${data.steam64id}`
        }
        } catch(err) {
        console.error(err);
        }
    }

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
            <div className="hidden md:flex justify-center">
                <form onSubmit={handleResolve} className="relative w-1/2">
                    <input type="text" onChange={(e) => setInput(e.target.value)} className="w-full border border-neutral-700 rounded-xl p-3 pl-11 outline-hidden" placeholder="Search by Steam ID or nickname..." />
                    <img src="../search.svg" className="h-6 w-6 absolute top-3 left-3" />
                </form>
            </div>
            <div className="flex flex-col md:flex-row gap-5">
                <div className="w-80">
                    <PlayerCard player={player}/>
                </div>
                <div className="w-full">
                    <PlayerOverview player={player} stats={stats} />
                </div>
            </div>
            <Footer />
        </div>
    )
}