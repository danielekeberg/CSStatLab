export default function Ranks({ player, matches }: { player: any, matches: any }) {
    function result(wins:any, loss:any) {
        if(wins === loss) {
            return "T"
        }
        if(wins > loss) {
            return "W"
        }
        if(wins < loss) {
            return "L"
        }
    }
    return(
        <>
            {player.leetify_raw?.ranks?.competitive && (
                <>
                    <div className="mt-10 mb-5">
                        <h1 className="text-xl font-bold">Ranks by Map</h1>
                        <p className="text-[#b3c0d3]">Individual Skill Rating for Each Competitive Map</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
                    {player.leetify_raw?.ranks?.competitive.filter((m:any) => m.rank > 0).sort((a:any, b:any) => b.rank - a.rank).map((m:any, i:any) => (
                        <div key={i} className="bg-[#383838]/20 border border-[#383838] rounded-xl p-5">
                            <div className="flex flex-col items-center justify-center w-full gap-2 pb-5">
                                <img src={`https://leetify.com/assets/images/map-icons/${m.map_name}.svg`} className="h-15" />
                                <p className="font-bold">{m.map_name.slice(3,4).toUpperCase()}{m.map_name.slice(4)}</p>
                            </div>
                            <div className="flex justify-center pb-5">
                                <img src={`https://leetify.com/assets/images/rank-icons/matchmaking${m.rank}.png`} className="h-8" />
                            </div>
                            <div className="flex justify-center gap-1">
                                {matches.filter((ma:any) => ma.map_name === m.map_name).slice(0,5).map((m:any) => (
                                    <div key={m.match_id} className="text-sm">
                                        <p className={`font-bold ${m.rounds_won > m.rounds_lost ? "text-green-500" : ''} ${m.rounds_won < m.rounds_lost ? "text-red-500" : ""}`}>{result(m.rounds_won, m.rounds_lost)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </>
            )}
        </>
    )
}