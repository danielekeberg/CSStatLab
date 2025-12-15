'use client';
import { CircularProgress } from "@/app/components/CircularProgress";
import Link from "next/link";
import { calcAvgAimLast30 } from "./AimScore";
import { Info } from "lucide-react";

export default function PlayerOverview({ player, stats, matches, matchRows}: { player: any, stats: any, matches: number, matchRows: any[] }) {
    console.log(player);
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
        const maxWinrate = 90;
        const x = (winrate - 55 ) / (maxWinrate - 55);
        const chance = 100 * ( x * x);
        return Math.min(100, Number(chance.toFixed(1))) 
    }

    function getOverallCheatChance(aim: number, preaim: number, ttd: number, kd: number, winrate: number): number {
        const aimChance = getAimCheatChance(aim)
        const preaimChance = getPreaimCheatChance(preaim)
        const ttdChance = getTTDCheatChance(ttd)
        const kdChance = getKdCheatChance(kd);
        const wrChance = getWinrateCheatChance(winrate);

        const total = aimChance + preaimChance + ttdChance + kdChance + wrChance;
        const average = total / 5;
        return Number((average).toFixed(1));
    }

    function getCheatRiskLabel(score: number): string {
        if(score <= 10) {
            return "Very low risk";
        }
        if(score <= 50) {
            return "Somewhat suspicious";
        }
        return "Extremely suspicious";
    }
    function getCheatRiskColor(score: number): string {
        if(score <= 10) {
            return "#eae8e0";
        }
        if(score <= 50) {
            return "#f97316";
        }
        return "#ef4444"
    }
    const avgAim = calcAvgAimLast30(matchRows) ?? player.leetify_raw?.rating.aim;
    const score = getOverallCheatChance(player?.leetify_raw?.rating?.aim, player?.leetify_raw?.stats?.preaim, player?.leetify_raw?.stats?.reaction_time_ms, stats.kd, player?.leetify_raw?.winrate);
    const riskText = getCheatRiskLabel(score);

    return(
        <div className="mt-5">
            <div className="p-4 rounded">
                <div className="flex justify-between">
                    <h1 className="font-bold text-xl">FairPlay <span className="text-[#07a4f1]">Insight</span></h1>
                    {matches < 15 && (
                        <div className="bg-yellow-600/20 py-1 px-2 rounded border border-yellow-600 text-xs flex gap-2 items-center font-bold">
                            <Info color={"#CA8A04"} />
                            <p>Stats may be inaccurate for new players. Accuracy improves as more matches are collected.</p>
                        </div>
                    )}
                </div>
                <div className="flex flex-col md:flex-row mt-6 min-h-40 gap-5">
                    {player.leetify_raw ? 
                    <>
                        <div className="md:w-60">
                            <div className="flex justify-center mb-2">
                                <CircularProgress value={score} color={getCheatRiskColor(score)} />
                            </div>
                            <div className="flex justify-center">
                                <p className={`text-xs ${riskText === "Extremely suspicious" ? 'font-bold' : ''} ${riskText === "Somewhat suspicious" ? 'font-[500]' : ''}`} style={{ color: getCheatRiskColor(score)}}>{riskText.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="grid md:flex md:w-[60%] gap-5 md:gap-10">
                            <div className="flex flex-col gap-5 md:w-1/2">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between">
                                        <p>K/D Ratio</p>
                                        <p>{stats.kd != null ? stats.kd.toFixed(2) : 'Not enough data'}</p>
                                    </div>
                                    <div className="h-2 flex items-center border border-neutral-600 rounded-full">
                                        <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ backgroundColor: getCheatRiskColor(getKdCheatChance(stats.kd)), width: `${getKdCheatChance(stats.kd)}%`}} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between">
                                        <p>Win Rate</p>
                                        <p>{player?.leetify_raw?.winrate ? `${(player?.leetify_raw?.winrate * 100).toFixed(1)}%` : 'Not enough data'}</p>
                                    </div>
                                    <div className="h-2 flex items-center border overflow-hidden border-neutral-600 rounded-full">
                                        <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ backgroundColor: getCheatRiskColor(getWinrateCheatChance(player?.leetify_raw?.winrate)), width: `${getWinrateCheatChance(player?.leetify_raw?.winrate)}%`}} />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-5 md:w-1/2">
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between">
                                        <p>Aim Rating</p>
                                        <p>{player.leetify_raw.rating.aim.toFixed(1)}</p>
                                    </div>
                                    <div className="h-2 flex items-center border overflow-hidden border-neutral-600 rounded-full">
                                        <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ backgroundColor: getCheatRiskColor(getAimCheatChance(player.leetify_raw.rating.aim)), width: `${getAimCheatChance(player.leetify_raw.rating.aim)}%`}} />
                                    </div>
                                </div>    
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between">
                                        <p>Preaim</p>
                                        <p>{player?.leetify_raw?.stats?.preaim ? `${player?.leetify_raw?.stats?.preaim.toFixed(1)}°` : 'Not enough data'}</p>
                                    </div>
                                    <div className="h-2 flex items-center border border-neutral-600 rounded-full">
                                        <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ backgroundColor: getCheatRiskColor(getPreaimCheatChance(player?.leetify_raw?.stats?.preaim)), width: `${player?.leetify_raw?.stats?.preaim ? getPreaimCheatChance(player?.leetify_raw?.stats?.preaim) : 0}%`}} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 text-sm">
                                    <div className="flex justify-between">
                                        <p>Time to Damage</p>
                                        <p>{player?.leetify_raw?.stats?.reaction_time_ms ? `${player?.leetify_raw?.stats?.reaction_time_ms.toFixed(1)}ms` : 'Not enough data'}</p>
                                    </div>
                                    <div className="h-2 flex items-center border border-neutral-600 rounded-full">
                                        <div className={`h-2 rounded-full bg-[#eae8e0]`} style={{ backgroundColor: getCheatRiskColor(getTTDCheatChance(player?.leetify_raw?.stats?.reaction_time_ms)), width: `${player?.leetify_raw?.stats?.reaction_time_ms ? getTTDCheatChance(player?.leetify_raw?.stats?.reaction_time_ms) : 0}%`}} />
                                    </div>
                                </div>
                            </div>           
                        </div>
                    </>
                    :
                    <p>We couldn’t find this player on Leetify. Showing available Steam data instead.</p>}
                </div>
                <div className="text-xs flex gap-10 border-t border-[#eae8e0]/30 mt-5 pt-5">
                    <p className="text-neutral-500"><span className="font-bold text-[#eae8e0]">Disclaimer: </span>FairPlay Insight provides statistical estimates based on gameplay data. Results are not definitive proof of cheating and may vary. Always consider additional context and factors when evaluating a player’s performance.</p>
                    <Link href="https://leetify.com" target="_blank" ><img src="../leetify.png" className="min-w-20 w-36" /></Link>
                </div>
            </div>
        </div>
    )
}