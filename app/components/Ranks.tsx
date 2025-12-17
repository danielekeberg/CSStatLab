export default function Ranks({ player }: { player: any }) {
    const label = [
        "Silver 1",
        "Silver 2",
        "Silver 3",
        "Silver 4",
        "Silver Elite",
        "Silver Elite Master",
        "Gold Nova 1",
        "Gold Nova 2",
        "Gold Nova 3",
        "Gold Nova Master",
        "Master Guardian",
        "Master Guardian 2",
        "MGE",
        "DMG",
        "Legendary Eagle",
        "Legendary Eagle Master",
        "Supreme",
        "The Global Elite"
    ]
    console.log(player)
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
                            <div className="flex justify-center">
                                <p className="text-[#b3c0d3] text-sm">{label[m.rank - 1]}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
            )}
        </>
    )
}