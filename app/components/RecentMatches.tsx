import { formatMatchTime } from "@/app/components/FormatMatchTime";

function label(prompt: any) {
    if(prompt === "matchmaking_competitive") {
        return "Competitive";
    }
    if(prompt === "matchmaking") {
        return "Premier";
    }
    if(prompt === "faceit") {
        return "FACEIT";
    }
    if(prompt === "matchmaking_wingman") {
        return "Wingman"
    }
    if(prompt === "hltv") {
        return "HTLV";
    }
}

export default function RecentMatches({ matches }: { matches: any[]}) {
    return(
        <>
        {matches.length != 0 && (
            <div className="mt-10">
                <h5 className="text-xl font-bold mb-3">Recent Games</h5>
                <div className="max-h-100 overflow-y-auto text-sm opacity-70">
                    <table className="w-full">
                        <tbody className="text-center">
                            {matches.map((m) => (
                                <tr key={m.match_id} className={`p-2 cursor-pointer hover:bg-neutral-100/10 grid grid-cols-3 border-b border-neutral-500/20 w-full ${m.has_banned_player && 'bg-red-900/40'}`}>
                                    <td className="flex items-center gap-3">
                                        <div className={`font-bold w-8 text-left ${m.rounds_won > m.rounds_lost && 'text-green-500'} ${m.rounds_won < m.rounds_lost && 'text-red-500'} ${m.rounds_won === m.rounds_lost && 'text-{#eae8e0]'}}`}><p>{m.rounds_won}:{m.rounds_lost}</p></div>
                                        <div>{m.map_name ? <div className="flex w-25 items-center gap-2"><img className="h-5" src={`https://leetify.com/assets/images/map-icons/${m.map_name}.svg`}/><p>{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</p></div> : <p>{m.map_name ? m.map_name : 'No data'}</p>}</div>
                                        <div>{label(m.mode)}</div>
                                    </td>
                                    <td className="flex items-center justify-start">{m.has_banned_player ? <p className="px-2 border border-red-800 rounded-xs font-bold text-xs py-0 text-[#eae8e0]" title="A player in this game has been banned">Ban</p> : null}</td>
                                    <td className="flex items-center justify-end gap-5">
                                        <div className="text-center">
                                            <div className="flex items-center jutify-end gap-2 text-[#b3c0d3]">
                                                <div>Kill</div>
                                                <p>/</p>
                                                <div>Death</div>
                                            </div>
                                            <div className="flex items-center jutify-end gap-2">
                                                <div>{m.total_kills}</div>
                                                <p>/</p>
                                                <div>{m.total_deaths}</div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center jutify-end gap-2 text-[#b3c0d3]">
                                                <div>ADR</div>
                                            </div>
                                            <div className="flex items-center jutify-end gap-2">
                                                <div>{m.dpr.toFixed(0)}</div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block text-right w-30">{formatMatchTime(m.finished_at)}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
        </>
    )
}

{/* <tr key={m.match_id} className={`p-2 grid grid-cols-7 md:grid-cols-8 border-b border-neutral-500/20 w-full ${m.has_banned_player && 'bg-red-900/40'}`}>
    <td>{m.map_name ? <div className="flex items-center gap-2"><img className="h-5" src={`https://leetify.com/assets/images/map-icons/${m.map_name}.svg`}/><p className="hidden md:block">{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</p></div> : <p>{m.map_name ? m.map_name : 'No data'}</p>}</td>
    <td className="flex items-center justify-start">{m.has_banned_player ? <p className="px-2 border border-red-800 rounded-xs font-bold text-xs py-0 text-[#eae8e0]" title="A player in this game has been banned">Ban</p> : null}</td>
    <td className={`font-bold text-left ${m.rounds_won > m.rounds_lost && 'text-green-500'} ${m.rounds_won < m.rounds_lost && 'text-red-500'} ${m.rounds_won === m.rounds_lost && 'text-{#eae8e0]'}}`}><p>{m.rounds_won}:{m.rounds_lost}</p></td>
    <td className="text-center hidden md:block">{m.mode === "matchmaking_competitive" && "Competitive"}{m.mode === "faceit" && "FACEIT"}{m.mode === "matchmaking" && "Premier"}{m.mode === "hltv" && "HLTV"}</td>
    <td>{(m.total_kills / m.total_deaths).toFixed(2)}</td>
    <td>{m.total_kills}</td>
    <td>{m.dpr.toFixed(0)}</td>
    <td className="hidden md:block text-right">{formatMatchTime(m.finished_at)}</td>
</tr> */}