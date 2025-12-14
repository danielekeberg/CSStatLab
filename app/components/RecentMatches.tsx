import { formatMatchTime } from "@/app/components/FormatMatchTime";

export default function RecentMatches({ matches }: { matches: any[]}) {
    return(
        <div className="mt-10 p-5">
            <h5 className="font-bold mb-3">Recent Games</h5>
            <div className="w-full p-2 grid grid-cols-7 md:grid-cols-8 text-sm opacity-70 font-bold border-b border-neutral-500 text-center">
                <p className="text-left">Map</p>
                <p></p>
                <p className="text-left">Score</p>
                <p className="text-center hidden md:block">Mode</p>
                <p>K/D</p>
                <p>Kills</p>
                <p>ADR</p>
                <p className="hidden md:block text-right">Date</p>
            </div>
            <div className="max-h-56 overflow-y-auto text-sm opacity-70">
                <table className="w-full">
                    <tbody className="text-center">
                        {matches.map((m) => (
                            <tr key={m.match_id} className={`p-2 grid grid-cols-7 md:grid-cols-8 border-b border-neutral-500/20 w-full ${m.has_banned_player && 'bg-red-900/40'}`}>
                                <td>{m.map_name ? <div className="flex items-center gap-2"><img className="h-5" src={`https://leetify.com/assets/images/map-icons/${m.map_name}.svg`}/><p className="hidden md:block">{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</p></div> : <p>{m.map_name ? m.map_name : 'No data'}</p>}</td>
                                <td className="flex items-center justify-start">{m.has_banned_player ? <p className="px-2 border border-red-800 rounded-xs font-bold text-xs py-0 text-[#eae8e0]" title="A player in this game has been banned">Ban</p> : null}</td>
                                <td className={`font-bold text-left ${m.rounds_won > m.rounds_lost && 'text-green-500'} ${m.rounds_won < m.rounds_lost && 'text-red-500'} ${m.rounds_won === m.rounds_lost && 'text-{#eae8e0]'}}`}><p>{m.rounds_won}:{m.rounds_lost}</p></td>
                                <td className="text-center hidden md:block">{m.mode === "matchmaking_competitive" && "Competitive"}{m.mode === "faceit" && "FACEIT"}{m.mode === "matchmaking" && "Premier"}{m.mode === "hltv" && "HLTV"}</td>
                                <td>{(m.total_kills / m.total_deaths).toFixed(2)}</td>
                                <td>{m.total_kills}</td>
                                <td>{m.dpr.toFixed(0)}</td>
                                <td className="hidden md:block text-right">{formatMatchTime(m.finished_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}