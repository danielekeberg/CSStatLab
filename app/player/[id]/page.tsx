'use client';
import { useParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Loader from "@/app/components/Loader";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/app/components/Header";

function extractVanity(input:any) {
    try {
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

type Data = {
    avatar: string;
    avatarFull: string;
    avatarMedium: string;
    id: string;
    name: string;
    url: string;
}

export default function Home() {
    const [player, setPlayer] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [input, setInput] = useState("");
    const [steamId, setSteamId] = useState("");
    const [data, setData] = useState<Data | null>(null);
    const params = useParams();
    const { id } = params;
    const [chartData, setChartData] = useState<any[]>([]);
    const [faceit, setFaceit] = useState<any>([]);
    const [match, setMatch] = useState<any[]>([]);

    function average(nums: number[]) {
        if(nums.length === 0) return 0;
        return nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    function formatDate(dateStr: string) {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
    const token = process.env.NEXT_PUBLIC_FACEIT_TOKEN;
  
    useEffect(() => {
        async function fetchPlayer() {
            try {
                const vanityRes = await fetch(`/api/steam/player?steamid=${id}`);
                const vanData = await vanityRes.json();
                const res = await fetch(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${id}`);
                setData(vanData)
                if(!res.ok) return;
                const data = await res.json();
                console.log(data);
                const faceitRes = await fetch(`https://open.faceit.com/data/v4/players?game=cs2&game_player_id=${id}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                const faceitData = await faceitRes.json();
                const recentMatches = data.recent_matches;
                const today = new Date();
                const days = 8;
                const fromDate = new Date();
                fromDate.setDate(today.getDate() - (days - 1));
                const matchesLast8Days = recentMatches.filter((match:any) => {
                  const finished = new Date(match.finished_at);
                  return finished >= fromDate;
                })
                const matchDetails = await Promise.all(matchesLast8Days.map((m:any) => fetch(`https://api-public.cs-prod.leetify.com/v2/matches/${m.id}`).then((res) => res.json())));
                console.log(matchDetails);
                setMatch(recentMatches);
                console.log(recentMatches)
                const grouped: Record<string, {now: number[] }> = {};
                for(const match of matchDetails) {
                  const dayKey = match.finished_at.slice(0,10);
                  if(!grouped[dayKey]) {
                    grouped[dayKey] = {now: []};
                  }
                  const playerStats = match.stats.find((p: any) => p.steam64_id === id);
                  if(!playerStats) continue;
                  grouped[dayKey].now.push(playerStats.leetify_rating * 100)
                  grouped[dayKey].now.push(playerStats.dpr / 5)
                  grouped[dayKey].now.push(playerStats.accuracy * 100)
                  grouped[dayKey].now.push(playerStats.counter_strafing_shots_good_ratio * 50)
                }
                console.log(grouped)
                const playerData = Object.entries(grouped)
                  .sort(([a], [b]) => (a > b ? 1 : -1))
                  .map(([date, values]) => ({
                    date: formatDate(date),
                    now: average(values.now),
                  }))
                  setChartData(playerData);
                  console.log(playerData)
                if(!res.ok) {
                    throw new Error('Something went wrong :D')
                }
                setFaceit(faceitData)
                setPlayer(data);
            } catch(err) {
                console.error("Error fetching user:", err);
            } finally {
            setLoading(false);
            }
        }
        fetchPlayer();
    },[])
    function getCheatChance(rating: number): number {
        if(rating < 90) return 0;
        const x = (rating - 90) / 10;
        const chance = 55.56 * x * x + 34.44 * x;
        return Math.min(99, Number(chance.toFixed(1))) 
    }
    return (
        <div className="px-15 md:px-[15%]">
            <Header />
        {loading ?
        <div className="h-[70vh] flex items-center justify-center">
            <Loader />
        </div>
        :
        <>
        <div className="flex justify-between my-10">
            <div className="flex gap-5">
                <img className="h-20 w-20 rounded-md border border-[#eae8e0]" src={data?.avatarFull ? data?.avatarFull : data?.avatar} />
                <div>
                    <div className="flex items-center gap-2">
                        <img src={`https://flagsapi.com/${faceit?.country.toUpperCase()}/flat/64.png`} className={`h-6 ${faceit.length <= 1 ? 'hidden' : 'block'}`} />
                        <h3 className="text-xl font-bold">{data?.name}</h3>
                    </div>
                    <p className="text-neutral-500 text-sm">{data?.id}</p>
                        <div className="flex gap-2">
                        <Link target="_blank" href={`${data?.url}`}><img className="h-6" src="../steam.svg" /></Link>
                        <Link target="_blank" href={`https://www.csstats.gg/player/${id}`}>CSStats</Link>
                        <Link target="_blank" href={`https://leetify.com/app/profile/${id}`}>Leetify</Link>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-5">
                <div className={`items-center gap-3 ${faceit.length <= 1 ? 'hidden' : 'flex'}`}>
                    <img className="h-8" src={`https://leetify.com/assets/images/rank-icons/faceit${player?.ranks.faceit}.svg`} />
                    <div className="flex gap-5 items-center font-bold">
                    <Link target="_blank" href={`https://www.faceit.com/en/players/${faceit.nickname}`}>{faceit?.nickname}</Link>
                    <p>{faceit?.games.cs2.faceit_elo}</p>
                    </div>
                </div>
                <div className={`${player?.ranks.premier ? "block" : "hidden"}`}>
                    <p className="text-sm">Premier</p>
                    <p className="font-bold">{player?.ranks.premier ? player?.ranks.premier : '---'}</p>
                </div>
            </div>
        </div>
        <div className="flex gap-3 font-bold text-sm text-neutral-400">
            <p className="text-[#eae8e0] cursor-pointer hover:text-neutral-300">Overview</p>
            <p className="cursor-pointer hover:text-neutral-300">Matches</p>
            <p className="cursor-pointer hover:text-neutral-300">Aim</p>
            <p className="cursor-pointer hover:text-neutral-300">Maps</p>
            <p className="cursor-pointer hover:text-neutral-300">Integrity</p>
        </div>
        <div className="grid grid-cols-5 gap-5 my-10">
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>K/D Ratio</p>
                </div>
                <h5 className="text-xl font-bold my-2">1.24</h5>
                <p className="text-sm text-neutral-400 my-1">last 30 games</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] w-[72%] h-2 rounded`} />
                </div>
            </div>
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>AIM</p>
                </div>
                <h5 className="text-xl font-bold my-2">{player?.rating.aim.toFixed(1)}</h5>
                <p className="text-sm text-neutral-400 my-1">last 30 games</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] h-2 rounded`} style={{ width: `${getCheatChance(player?.rating.aim)}%`}} />
                </div>
            </div>
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>ADR</p>
                </div>
                <h5 className="text-xl font-bold my-2">124</h5>
                <p className="text-sm text-neutral-400 my-1">last 30 games</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] w-[72%] h-2 rounded`} />
                </div>
            </div>
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>Preaim Degree</p>
                </div>
                <h5 className="text-xl font-bold my-2">{player?.stats.preaim.toFixed(1)}°</h5>
                <p className="text-sm text-neutral-400 my-1">last 30 games</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] w-[72%] h-2 rounded`} />
                </div>
            </div>
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>Time To Damage</p>
                </div>
                <h5 className="text-xl font-bold my-2">{player?.stats.reaction_time_ms.toFixed(1)}ms</h5>
                <p className="text-sm text-neutral-400 my-1">last 30 games</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] w-[72%] h-2 rounded`} />
                </div>
            </div>
        </div>
        <div className="flex gap-10">
            <div className="w-full h-80">
                <div className="mb-5 flex justify-between">
                    <div>
                        <h5 className="font-bold">Performance Trend</h5>
                        <p className="text-neutral-400 text-sm">Rating over last 8 matches</p>
                    </div>
                    <div className="flex items-center gap-3">
                    <div className="flex gap-2 items-center">
                        <div className="h-2 w-2 rounded-full bg-[#444]" />
                        <p>Last Week</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="h-2 w-2 rounded-full bg-[#eae8e0]" />
                        <p>This Week</p>
                    </div>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                    <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis tick={{ fontSize: 12 }} dataKey="date" />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={(value: number) => value.toFixed(2)} domain={[0.8, 1.6]} />
                    <Tooltip formatter={(value:number, name: string) => {
                        if(name === "This Week") { return [value.toFixed(2), name]}
                        if(name === "Last Week") { return [value.toFixed(2), name]}
                        return [value, name] }}
                        contentStyle={{backgroundColor: "#0a0a0a", borderRadius: 8, border: "1px solid #e5e7eb"}} labelStyle={{ fontSize: 12, color: "#eae8e0"}} itemStyle={{ fontSize: 13, fontWeight: 600}} />

                        <Line
                        type="monotone"
                        dataKey="now"
                        name="This Week"
                        stroke="#eae8e0"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        />

                        <Line
                        type="monotone"
                        dataKey="last"
                        name="Last Week"
                        stroke="#444"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                        />

                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="w-100">
                <h5 className="font-bold">Current Form</h5>
                <div>
                    <div className="flex justify-between my-2 text-sm">
                    <p className="text-neutral-500">Form Score</p>
                    <p className="font-bold">72/100</p>
                    </div>
                    <div className="w-full h-2 my-2 border border-[#eae8e0]/20 rounded-full overflow-hidden">
                    <div className="h-2 w-[72%] bg-[#eae8e0] rounded-full" />
                    </div>
                    <div className="text-sm flex justify-between">
                    <p className="text-neutral-500">Based on last 20 matches:</p>
                    <p className="font-bold">Good</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-10 mb-3">
            <h5 className="font-bold">Recent Games</h5>
            
        </div>
        <table className="w-full rounded-xl mb-100">
            <thead>
                <tr className="grid rounded-t-xl bg-neutral-900 grid-cols-9 px-5 py-3 border-b border-neutral-100/10 border border-neutral-100/10">
                    <td>Map</td>
                    <td></td>
                    <td>Date</td>
                    <td>Score</td>
                    <td>Rank</td>
                    <td>Kills</td>
                    <td>Deaths</td>
                    <td>K/D</td>
                    <td>AIM</td>
                </tr>
            </thead>
            <tbody className="block max-h-80 overflow-y-auto rounded-b-xl border border-neutral-100/10">
                {match.slice(0,10).map((m) => (
                    <tr key={m.id} className={`grid p-5 border-b cursor-pointer border-neutral-100/10 grid-cols-9 items-center bg-neutral-900/50 hover:bg-neutral-800`}>
                        <td className="flex gap-2 items-center">
                            <img className="h-8" src={`https://leetify.com/assets/images/map-icons/${m.map_name}.svg`} />
                            <h1 className="font-bold">{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</h1>
                        </td>
                        <td></td>
                        <td>{m.finished_at.slice(0,10)}</td>
                        <td className={`font-bold ${m.outcome === "win" ? 'text-green-900' : ''} ${m.outcome === "loss" ? 'text-red-900' : ''} ${m.outcome === "tie" ? 'text-neutral-500' : ''}`}>{m.score?.[0]}:{m.score?.[1]}</td>
                        {m.rank > 20 ? <td>{m.rank}</td> : <td><img className="h-7" src={`https://leetify.com/assets/images/rank-icons/matchmaking${m.rank}.png`} /></td>}
                        <td>kills</td>
                        <td>deaths</td>
                        <td>kd</td>
                        <td>aim</td>
                    </tr>
                ))}
            </tbody>
        </table>
        </>}
    </div>
  );
}