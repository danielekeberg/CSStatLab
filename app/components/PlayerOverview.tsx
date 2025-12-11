import Link from "next/link";
import { PremierRankBadge } from "@/app/components/PremierRankBadge";

type PlayerStats = {
  steam64_id: string;
  kd_ratio: number;
};

type Match = {
  id: string;
  map_name: string;
  raw: any;
  stats: PlayerStats[];
};

export default function PlayerOverview({ player, matches }: { player: any, matches: any }) {

    function getCheatChance(rating: number): number {
        if(rating < 90) return 0;
        const x = (rating - 90) / 10;
        const chance = 55.56 * x * x + 34.44 * x;
        return Math.min(99, Number(chance.toFixed(1))) 
    }
    
    const STEAM_ID = player.id;

    function getAverageKd(matches: Match[], steamId: string) {
        const kdValues: number[] = [];

        for (const match of matches) {
            const player = match.raw.stats.find((p:any) => p.steam64_id === steamId);

            if (player && typeof player.kd_ratio === "number") {
            kdValues.push(player.kd_ratio);
            }
        }

        if (kdValues.length === 0) return 0;

        const sum = kdValues.reduce((acc, val) => acc + val, 0);
        return (sum / kdValues.length).toFixed(1);
    }

    return(
        <>
        <div className="grid grid-cols-1 md:flex gap-8 justify-between my-10">
            <div className="flex gap-5">
                <img src={player.avatar} className="h-20 w-20 rounded border border-neutral-200" />
                <div>
                    <div className="flex items-center gap-2">
                        {player.country && <img src={`https://flagsapi.com/${player.country}/flat/64.png`} className="h-6" />}
                        <h3 className="text-xl font-bold">{player.name}</h3>
                    </div>
                    <p className="text-neutral-400 text-sm mb-1">{player.id}</p>
                    <div className="gap-2 hidden md:flex">
                        <Link target="_blank" href={player.steam_url}><img className="h-6" src="../steam.svg" /></Link>
                        <Link target="_blank" href={`https://www.csstats.gg/player/${player.id}`}>CSStats</Link>
                        <Link target="_blank" href={`https://leetify.com/app/profile/${player.id}`}>Leetify</Link>
                    </div>
                </div>
            </div>

            <div className="flex justify-between gap-6 items-center">
                {player.faceit_raw && (
                    <div className="flex items-center gap-4">
                        <img className="h-8" src={`https://leetify.com/assets/images/rank-icons/faceit${player.faceit_raw.games.cs2.skill_level}.svg`} />
                        <div className="flex gap-4 items-center font-bold">
                            <Link target="_blank" className="hidden md:block" href={`https://www.faceit.com/en/players/${player.faceit_raw.nickname}`}>{player.faceit_raw.nickname}</Link>
                            <p>{player.faceit_raw.games.cs2.faceit_elo}</p>
                        </div>
                    </div>
                )}
                {player.leetify_raw.ranks.premier && (
                    <PremierRankBadge rating={player.leetify_raw.ranks.premier} />
                )}
            </div>
        </div>

        <div className="flex justify-center md:justify-start gap-3 font-bold text-neutral-500 text-sm">
                <p className="text-[#eae8e0] cursor-pointer hover:text-[#eae8e0] transition duration-100">Overview</p>
                <p className="cursor-pointer hover:text-[#eae8e0] transition duration-100">Matches</p>
                <p className="cursor-pointer hover:text-[#eae8e0] transition duration-100">Aim</p>
                <p className="cursor-pointer hover:text-[#eae8e0] transition duration-100">Maps</p>
                <p className="cursor-pointer hover:text-[#eae8e0] transition duration-100">Integrity</p>
            </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 my-10">
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>K/D Ratio</p>
                </div>
                <h5 className="text-xl font-bold my-2">{getAverageKd(matches, STEAM_ID)}</h5>
                <p className="text-sm text-right text-neutral-400 my-1">Normal</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] w-[0%] h-2 rounded`} />
                </div>
            </div>
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>Aim</p>
                </div>
                <h5 className="text-xl font-bold my-2">{player.leetify_raw.rating.aim.toFixed(1)}</h5>
                <p className="text-sm text-right text-neutral-400 my-1">Normal</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] h-2 rounded`} style={{ width: `${getCheatChance(player.leetify_raw.rating.aim)}%`}} />
                </div>
            </div>
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>Win Rate</p>
                </div>
                <h5 className="text-xl font-bold my-2">
                    {(() => {
                        const recent = player.leetify_raw.recent_matches?.slice(0, 30) ?? [];
                        const wins = recent.filter((g:any) => g.outcome === "win").length;
                        const winrate = recent.length ? (wins / recent.length) * 100 : 0;
                        return `${winrate.toFixed(1)}%`;
                    })()}
                </h5>
                <p className="text-sm text-right text-neutral-400 my-1">Normal</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] w-[0%] h-2 rounded`} />
                </div>
            </div>
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>Preaim Degree</p>
                </div>
                <h5 className="text-xl font-bold my-2">{player.leetify_raw.stats.preaim.toFixed(1)}°</h5>
                <p className="text-sm text-right text-neutral-400 my-1">Normal</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] w-[0%] h-2 rounded`} />
                </div>
            </div>
            <div className="bg-neutral-900 p-3 rounded">
                <div className="flex justify-between text-sm">
                    <p>Time To Damage</p>
                </div>
                <h5 className="text-xl font-bold my-2">{player.leetify_raw.stats.reaction_time_ms.toFixed(1)}ms</h5>
                <p className="text-sm text-right text-neutral-400 my-1">Normal</p>
                <div className="border border-[#eae8e0]/20 mt-2 w-full h-2 rounded overflow-hidden">
                    <div className={`bg-[#eae8e0] w-[0%] h-2 rounded`} />
                </div>
            </div>
        </div>
        </>
    )
}