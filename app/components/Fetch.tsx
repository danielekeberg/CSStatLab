'use client';
import { useEffect, useState } from "react";

export default function Fetch() {
    const [user, setUser] = useState<string>("76561198369432059");
    const [player, setPlayer] = useState<any | null>(null);

    useEffect(() => {
        async function fetchPlayer() {
            try {
                const res = await fetch(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${user}`);
                const data = await res.json();
                if(!res.ok) {
                    throw new Error('Something went wrong :D')
                }
                setPlayer(data);
            } catch(err) {
                console.error("Error fetching user:", err);
            }
        }
        fetchPlayer();
    },[user])
    console.log(player);
    return(
        <>
        {player && (
            <div className="px-5">
            <div>
                <div>
                    <img />
                    <h1>Core Statistics</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded">
                        <p>K/D RATIO</p>
                        <p>{player.rating.aim}</p>
                    </div>
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded">
                        <p>AIM RATING</p>
                        <p>{player.rating.aim}</p>
                    </div>
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded">
                        <p>WIN RATE</p>
                        <p>61.42</p>
                    </div>
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded">
                        <p>TIME TO DAMAGE</p>
                        <p>{player.stats.reaction_time_ms.toFixed(0)} ms</p>
                    </div>
                    <div className="p-5 bg-neutral-900 border border-neutral-800 rounded">
                        <p>PREAIM DEGREE</p>
                        <p>{player.stats.preaim}</p>
                    </div>
                </div>
            </div>
        </div>
        )}
        </>
    )
}