'use client';
import { CircularProgress } from "@/app/components/CircularProgress";

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

    function getAimCheatChance(rating: number): number {
        if(rating < 90) return 0;
        const x = (rating - 90) / 10;
        const chance = 55.56 * x * x + 55.56 * x;
        return Math.min(100, Number(chance.toFixed(1))) 
    }

    function getKdCheatChance(kd: number): number {
        if(kd < 1.7) return 0;
        const maxKD = 2.1;
        const x = (kd - 1.7) / (maxKD - 1.5);
        const chance = 100 * ( x * x);
        return Math.min(100, Number(chance.toFixed(1))) 
    }

    function getPreaimCheatChance(preaim: number): number {
        if(preaim >= 7) return 0;
        const minPreaim = 5;
        const x = (7 - preaim) / (7 - minPreaim);
        const chance = 100 * ( x * x);
        return Math.min(100, Number(chance.toFixed(1))) 
    }

    function getTTDCheatChance(ttd: number): number {
        if(ttd >= 500) return 0;
        const minTTD = 400;
        const x = (500 - ttd) / (500 - minTTD);
        const chance = 100 * ( x * x);
        return Math.min(100, Number(chance.toFixed(1))) 
    }

    function getWinrateCheatChance(winrate: number): number {
        if(winrate < 55) return 0;
        const maxWinrate = 70;
        const x = (winrate - 55 ) / (maxWinrate - 55);
        const chance = 100 * ( x * x);
        return Math.min(100, Number(chance.toFixed(1))) 
    }

    function getOverallCheatChance(aim: number, preaim: number, ttd: number): number {
        const aimChance = getAimCheatChance(aim)
        const preaimChance = getPreaimCheatChance(preaim)
        const ttdChance = getTTDCheatChance(ttd)

        const total = aimChance + preaimChance + ttdChance;
        const average = total / 3;
        return Number((average).toFixed(1));
    }

    function getCheatRiskLabel(score: number): string {
        if(score <= 10) {
            return "Very low risk";
        }
        if(score <= 50) {
            return "Somewhat risky";
        }
        return "Extremely sus";
    }

    const score = getOverallCheatChance(player.leetify_raw.rating.aim, player.leetify_raw.stats.preaim, player.leetify_raw.stats.reaction_time_ms);
    const riskText = getCheatRiskLabel(score);
    
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
        <div className="my-10">
            <div className="p-5 rounded">
                <h1 className="font-bold text-2xl">CSStatLab - FairPlay Insight</h1>
                <div className="flex mt-6 gap-5">
                    <div className="w-60">
                        <div className="flex justify-center mb-2">
                            <CircularProgress value={score} />
                        </div>
                        <div className="flex justify-center">
                            <p className="text-sm">{riskText}</p>
                        </div>
                    </div>
                    <div className="flex w-[60%] gap-10">
                        <div className="flex flex-col gap-5 w-1/2">
                            <div className="flex flex-col gap-1 text-sm">
                                <div className="flex justify-between">
                                    <p>K/D Ratio</p>
                                    <p>{getAverageKd(matches, STEAM_ID)}</p>
                                </div>
                                <div className="h-2 flex items-center border border-neutral-600 rounded-full">
                                    <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ width: `${getKdCheatChance(1)}%`}} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 text-sm">
                                <div className="flex justify-between">
                                    <p>Preaim</p>
                                    <p>{player.leetify_raw.stats.preaim.toFixed(1)}°</p>
                                </div>
                                <div className="h-2 flex items-center border border-neutral-600 rounded-full">
                                    <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ width: `${getPreaimCheatChance(player.leetify_raw.stats.preaim)}%`}} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 text-sm">
                                <div className="flex justify-between">
                                    <p>Time to Damage</p>
                                    <p>{player.leetify_raw.stats.reaction_time_ms.toFixed(1)}ms</p>
                                </div>
                                <div className="h-2 flex items-center border border-neutral-600 rounded-full">
                                    <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ width: `${getTTDCheatChance(player.leetify_raw.stats.reaction_time_ms)}%`}} />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 w-1/2">
                            <div className="flex flex-col gap-1 text-sm">
                                <div className="flex justify-between">
                                    <p>Aim Rating</p>
                                    <p>{player.leetify_raw.rating.aim.toFixed(1)}</p>
                                </div>
                                <div className="h-2 flex items-center border overflow-hidden border-neutral-600 rounded-full">
                                    <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ width: `${getAimCheatChance(player.leetify_raw.rating.aim)}%`}} />
                                </div>
                            </div>    
                            <div className="flex flex-col gap-1 text-sm">
                                <div className="flex justify-between">
                                    <p>Win Rate</p>
                                    <p>{(() => {
                                            const recent = player.leetify_raw.recent_matches?.slice(0, 30) ?? [];
                                            const wins = recent.filter((g:any) => g.outcome === "win").length;
                                            const winrate = recent.length ? (wins / recent.length) * 100 : 0;
                                            return `${winrate.toFixed(1)}%`;
                                        })()}</p>
                                </div>
                                <div className="h-2 flex items-center border overflow-hidden border-neutral-600 rounded-full">
                                    <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ width: `${getWinrateCheatChance(45)}%`}} />
                                </div>
                            </div>    
                        </div>           
                    </div>
                </div>
                <div className="text-xs border-t border-[#eae8e0]/30 mt-5 pt-5">
                    <p className="text-neutral-500"><span className="font-bold text-[#eae8e0]">Disclaimer: </span>FairPlay Insight provides statistical estimates based on gameplay data. Results are not definitive proof of cheating and may vary. Always consider additional context and factors when evaluating a player’s performance.</p>
                </div>
            </div>
            {/* <div className="flex my-10 justify-center md:justify-start gap-3 font-bold text-neutral-500 text-sm">
                <p className="text-[#eae8e0] cursor-pointer hover:text-[#eae8e0] transition duration-100">Overview</p>
                <p className="cursor-pointer hover:text-[#eae8e0] transition duration-100">Matches</p>
                <p className="cursor-pointer hover:text-[#eae8e0] transition duration-100">Aim</p>
                <p className="cursor-pointer hover:text-[#eae8e0] transition duration-100">Maps</p>
                <p className="cursor-pointer hover:text-[#eae8e0] transition duration-100">Integrity</p>
            </div> */}
        </div>
    )
}