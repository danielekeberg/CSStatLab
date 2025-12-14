type Match = {
    match_id: string;
    rounds_won: number;
    rounds_lost: number;
}
export default function RecentWins({ matches }: { matches: Match[]}) {
    console.log(matches);
    
    const last30 = matches.slice(0,30);
    const wins = last30.filter(match => match.rounds_won > match.rounds_lost).length;
    const loss = last30.filter(match => match.rounds_won < match.rounds_lost).length;
    const tie = last30.filter(match => match.rounds_won === match.rounds_lost).length;
    const totalMatches = wins + loss + tie;
    return(
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-5 px-4">
            <div className="border border-neutral-500/20 p-2 rounded bg-neutral-900/50">
                <h1 className="text-xl text-neutral-400">Winrate</h1>
                <p className="text-2xl font-bold">{Math.round((wins / totalMatches) * 100)}%</p>
            </div>
            <div className="border border-neutral-500/20 p-2 rounded bg-neutral-900/50">
                <h1 className="text-xl text-neutral-400">Total wins</h1>
                <p className="text-2xl font-bold">{wins}<span className="text-sm text-neutral-400">W</span></p>
            </div>
            <div className="border border-neutral-500/20 p-2 rounded bg-neutral-900/50">
                <h1 className="text-xl text-neutral-400">Total loss</h1>
                <p className="text-2xl font-bold">{loss}<span className="text-sm text-neutral-400">L</span></p>
            </div>
            <div className="border border-neutral-500/20 p-2 rounded bg-neutral-900/50">
                <h1 className="text-xl text-neutral-400">Total ties</h1>
                <p className="text-2xl font-bold">{tie}<span className="text-sm text-neutral-400">T</span></p>
            </div>
        </div>
    )
}