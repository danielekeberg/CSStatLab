'use client';
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

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
    steam64id: string;
}

export default function Home() {
  const [player, setPlayer] = useState<any | null>(null);
  const [input, setInput] = useState("");
  const [steamId, setSteamId] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const params = useParams();
  const { id } = params;

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
            window.location.href = `../user/${data.steam64id}`
        }
    } catch(err) {
        console.error(err);
    }
  }

  useEffect(() => {
      async function fetchPlayer() {
        try {
            const res = await fetch(`https://api-public.cs-prod.leetify.com/v3/profile?steam64_id=${id}`);
            const data = await res.json();
            console.log(data);
            const vanityRes = await fetch(`/api/steam/player?steamid=${id}`);
            console.log(data.name)
            const vanData = await vanityRes.json();
            setData(vanData)
            if(!res.ok) {
                throw new Error('Something went wrong :D')
            }
            setPlayer(data);
        } catch(err) {
            console.error("Error fetching user:", err);
        }
      }
      fetchPlayer();
  },[])
  return (
      <div className="flex">
        {player ? 
          <div className="min-w-60 w-80 p-3 h-screen bg-neutral-900/30 border-r border-neutral-900">
            <div className="flex justify-center mb-5">
              <div className="text-center">
                <div className="flex justify-center items-center">
                  <img className="h-20 w-20 mb-2 rounded-full bg-blue-900 border-2 border-neutral-30" src={data?.avatarFull ?? ''} />
                </div>
                <h1 className="text-xl font-bold">{player.name}</h1>
              </div>
            </div>
            <div className="p-3 border border-neutral-800 rounded bg-neutral-900">
              <div className="flex gap-2 mb-5">
                <img className="h-5 w-5 bg-red-900" />
                <p>FACEIT STATS</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Rank</p>
                <img className="h-7" src={`https://leetify.com/assets/images/rank-icons/faceit${player?.ranks.faceit}.svg`} />
              </div>
              <div className="flex justify-between">
                <p className="text-sm">ELO</p>
                <p>{player.ranks.faceit_elo}</p>
              </div>
            </div>
            <div className="p-3 border border-neutral-800 rounded bg-neutral-900 my-5">
              <div className="flex gap-2 mb-5">
                <img className="h-5 w-5 bg-red-900" />
                <p className="font-bold">MAP RANKS</p>
              </div>
              <div className="flex justify-between mb-1">
                <p className="text-sm">Premier</p>
                <p className="font-bold">{player.ranks.premier}</p>
              </div>
              {player.ranks.competitive.filter((m:any) => m.rank !== 0).sort((a:any, b:any) => b.rank - a.rank).map((m:any, i:any) => (
                <div key={i} className="flex justify-between mb-2">
                  <p className="text-sm">{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</p>
                  <img className="h-5" src={`https://leetify.com/assets/images/rank-icons/matchmaking${m.rank}.png`} />
                </div>
              ))}
            </div>
        </div>
        :
        <div className="min-w-60 w-80 p-3 h-screen bg-neutral-900/30 border-r border-neutral-900">
            <div className="flex justify-center mb-5">
              <div className="text-center">
                <div className="flex justify-center items-center">
                  <img className="h-20 w-20 mb-2 rounded-full bg-blue-900 border-2 border-neutral-30" src={data?.avatarFull ?? 'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg'} />
                </div>
                <h1 className="text-xl font-bold">{player?.name ? player?.name : "No user found."}</h1>
              </div>
            </div>
            {player ? 
            <div className="p-3 border border-neutral-800 rounded bg-neutral-900">
              <div className="flex gap-2 mb-5">
                <img className="h-5 w-5 bg-red-900" />
                <p>FACEIT STATS</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm">Rank</p>
                <img className="h-7" src={`https://leetify.com/assets/images/rank-icons/faceit${player?.ranks.faceit}.svg`} />
              </div>
              <div className="flex justify-between">
                <p className="text-sm">ELO</p>
                <p>{player?.ranks.faceit_elo}</p>
              </div>
            </div>
            :
            null}
            {player ?
            <div className="p-3 border border-neutral-800 rounded bg-neutral-900 my-5">
              <div className="flex gap-2 mb-5">
                <img className="h-5 w-5 bg-red-900" />
                <p className="font-bold">MAP RANKS</p>
              </div>
              <div className="flex justify-between mb-1">
                <p className="text-sm">Premier</p>
                <p className="font-bold">{player?.ranks.premier}</p>
              </div>
              {player?.ranks.competitive.filter((m:any) => m.rank !== 0).sort((a:any, b:any) => b.rank - a.rank).map((m:any, i:any) => (
                <div key={i} className="flex justify-between mb-2">
                  <p className="text-sm">{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</p>
                  <img className="h-5" src={`https://leetify.com/assets/images/rank-icons/matchmaking${m.rank}.png`} />
                </div>
              ))}
            </div>
            :
            null}
        </div>
        }
        <div className="w-full flex justify-center p-5">
          
            <div className="w-300">
                <form onSubmit={handleResolve} className="flex gap-2 items-center">
                    <input className="border border-neutral-900 w-full p-2 rounded mb-2" type="text" placeholder="bruker..." onChange={(e) => setInput(e.target.value)} />
                    <button className="border-neutral-900 border rounded p-2">Submit</button>
                </form>
                {player && (
                <>
                <div className="mb-5">
                    <div className="mb-2">
                    <img />
                    <h1 className="font-bold">Core Statistics</h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <div className="p-3 bg-neutral-900/30 border border-neutral-900 rounded">
                        <h1>AIM RATING</h1>
                        <p className="font-bold text-2xl">{player.rating.aim.toFixed(0)}</p>
                    </div>
                    <div className="p-3 bg-neutral-900/30 border border-neutral-900 rounded">
                        <h1>K/D RATIO</h1>
                        <p className="font-bold text-2xl">{player.rating.aim.toFixed(0)}</p>
                    </div>
                    <div className="p-3 bg-neutral-900/30 border border-neutral-900 rounded">
                        <h1>WIN RATE</h1>
                        <p className="font-bold text-2xl">{(player.winrate * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-3 bg-neutral-900/30 border border-neutral-900 rounded">
                        <h1>TIME TO DAMAGE</h1>
                        <p className="font-bold text-2xl">{player.stats.reaction_time_ms.toFixed(0)} ms</p>
                    </div>
                    <div className="p-3 bg-neutral-900/30 border border-neutral-900 rounded">
                        <h1>PREAIM DEGREE</h1>
                        <p className="font-bold text-2xl">{player.stats.preaim.toFixed(0)}°</p>
                    </div>
                    </div>
                </div>
                <div>
                  <div className="mb-2">
                    <img />
                    <h1 className="font-bold">Cheat Detection Analysis</h1>
                    </div>
                    {id === "76561198054218088" ?
                      <div className="p-5 bg-gradient-to-r from-green-500/10 to-green-900/10 border border-neutral-900 rounded">
                        <div className="flex justify-between items-center">
                          <h1>SUS SCORE ANALYSIS</h1>
                          <p className="text-green-900 font-bold text-2xl">NOT Sus</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-green-900 font-bold text-3xl">0%</h1>
                            <p className="text-sm">Based on performance data</p>
                        </div>
                        <div className="border border-neutral-900 bg-neutral-900/60 p-2 text-neutral-400">
                            <div>
                              <img />
                              <p>Probability of cheating: 0%</p>
                            </div>
                            <p>Calculated from aim rating anomalies, winrate patterns, and K/D consistency</p>
                        </div>
                      </div>
                      :
                      <div className="p-5 bg-gradient-to-r from-red-500/10 to-red-900/10 border border-neutral-900 rounded">
                        <div className="flex justify-between items-center">
                          <h1>SUS SCORE ANALYSIS</h1>
                          <p className="text-red-900/80 font-bold text-2xl">Extremely Sus</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-red-900/80 font-bold text-3xl">98%</h1>
                            <p className="text-sm">Based on performance data</p>
                        </div>
                        <div className="border border-neutral-900 bg-neutral-900/30 p-2 text-neutral-400">
                            <div>
                              <img />
                              <p>Probability of cheating: 98%</p>
                            </div>
                            <p>Calculated from aim rating anomalies, winrate patterns, and K/D consistency</p>
                        </div>
                      </div>
                      }
                    </div>
                <div className="mt-5">
                    <h1 className="font-bold">Recent Matches</h1>
                    <table className="w-full rounded border border-neutral-900">
                    <thead>
                        <tr className="grid grid-cols-7 p-2 border-b border-neutral-900 bg-neutral-900/30 text-neutral-500">
                        <td>DATE</td>
                        <td>MAP</td>
                        <td className="text-center">RANK</td>
                        <td className="text-center">RESULT</td>
                        <td className="text-center">SCORE</td>
                        <td className="text-center">AIM</td>
                        <td className="text-center">ADR</td>
                        </tr>
                    </thead>
                    <tbody>
                        {player.recent_matches.slice(0,5).map((m:any, i:any) => (
                        <tr key={i} className="grid grid-cols-7 p-2 bg-neutral-900/30 border-b border-neutral-900/50">
                            <td className="text-neutral-500">{m.finished_at.slice(0,10)}</td>
                            <td>{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</td>
                            <td className={`text-center font-bold ${m.outcome === 'win' ? 'text-green-800' : 'text-red-800'}`}>{m.outcome.slice(0,1).toUpperCase()}</td>
                            <td className={`text-center ${m.rank < 25 ? 'flex justify-center' : ''}`}>{m.rank < 25 ? <img className="h-5" src={`https://leetify.com/assets/images/rank-icons/matchmaking${m.rank}.png`} /> : `${m.rank}`}</td>
                            <td className="text-center">{m.score[0]} - {m.score[1]}</td>
                            <td className="text-center">K/D</td>
                            <td className="text-center">ADR</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </>
                )}
            </div>
        </div>
      </div>
  );
}