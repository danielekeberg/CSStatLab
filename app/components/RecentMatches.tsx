export default function RecentMatches({ matches }: { matches: any[]}) {
    return(
        <div className="mt-10 p-5">
            <h5 className="font-bold mb-3">Recent Games</h5>
            <div className="w-full p-2 grid grid-cols-8 text-sm opacity-70 font-bold">
                <p>Map</p>
                <p>Mode</p>
                <p>Outcome</p>
                <p>K/D</p>
                <p>Kills</p>
                <p>Deaths</p>
                <p>ADR</p>
                <p>Date</p>
            </div>
            <div className="max-h-56 overflow-y-auto text-sm opacity-70">
                <table className="w-full">
                    <tbody>
                        {matches.map((m) => (
                            <tr key={m.match_id} className={`p-2 grid grid-cols-8 border-b border-neutral-500/20 w-full ${!m.has_banned_player && 'bg-red-900/40'}`}>
                                <td>{m.map_name ? <div className="flex items-center gap-2"><img className="h-5" src={`https://leetify.com/assets/images/map-icons/${m.map_name}.svg`}/>{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</div> : <p>{m.map_name ? m.map_name : 'No data'}</p>}</td>
                                <td>{m.mode}</td>
                                <td className="font-bold">{m.rounds_won > m.rounds_lost ? <p className="text-green-500">{m.rounds_won}:{m.rounds_lost}</p> : <p className="text-red-500">{m.rounds_lost}:{m.rounds_won}</p>}</td>
                                <td>{(m.total_kills / m.total_deaths).toFixed(2)}</td>
                                <td>{m.total_kills}</td>
                                <td>{m.total_deaths}</td>
                                <td>{m.dpr.toFixed(0)}</td>
                                <td>{m.finished_at.slice(0,10)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}