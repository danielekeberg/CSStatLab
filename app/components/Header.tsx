'use client';
import Link from "next/link";
import { useState, useEffect } from "react";

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

export default function Header({ status }: { status: boolean }) {
    const [isActive, setIsActive] = useState(status);
    const [input, setInput] = useState("");
    const [steamId, setSteamId] = useState("");
    useEffect(() => {
        setIsActive(status);
    }, [status])

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

    return(
        <div className="py-5 flex justify-between items-center">
            {!isActive ? 
            <div className="flex justify-center w-full">
                <Link href="../" className="flex italic text-2xl font-bold">
                    <img src="../csstatlab-logo.png" className="h-12" />
                </Link>
            </div>
            :
            <div>
                <Link href="../" className="flex italic text-2xl font-bold">
                    <img src="../csstatlab-logo.png" className="h-12" />
                </Link>
            </div>
            }
            {isActive && (
                <div className="hidden md:flex w-1/3 justify-center">
                    <form onSubmit={handleResolve} className="relative w-full">
                        <input type="text" onChange={(e) => setInput(e.target.value)} className="w-full border border-neutral-700 bg-[#383838]/20 border border-[#383838] rounded-full p-3 pl-11 outline-hidden" placeholder="Search by Steam ID or nickname..." />
                        <img src="../search.svg" className="h-8 w-6 absolute top-2 left-3" />
                    </form>
                </div>
            )}
        </div>
    )
}