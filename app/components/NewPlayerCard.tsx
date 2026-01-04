import Link from "next/link";
import { PremierRankBadge } from "@/app/components/PremierRankBadge";
import { formatMatchTime } from "./FormatMatchTime";
import { Info } from "lucide-react";

export default function PlayerCard({ player }: { player: any }) {
    return(
        <div className="flex justify-center p-5 bg-[#383838]/20 border border-[#383838] rounded-xl mt-10">
            <div className="flex flex-col md:flex-row gap-10 w-full justify-between">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <img src={player.avatar} className="h-25 w-25 rounded border border-neutral-200" />
                    <div>
                        <div className="flex justify-center md:justify-start items-center gap-2">
                            {player.country && <img src={`https://flagsapi.com/${player.country}/flat/64.png`} className="h-6" />}
                            <h3 className="text-xl font-bold text-center">{player.name}</h3>
                        </div>
                        <p className="text-neutral-400 text-sm mb-3">{player.id}</p>
                        <div className="gap-2 hidden md:flex justify-start items-top">
                            {player.faceit_raw !== null && player.faceit_raw?.length !== 0 ? 
                                <div className="flex flex-col items-center">
                                    <Link className="hover:bg-neutral-900 p-1 transition rounded" target="_blank" href={`https://www.faceit.com/en/players/${player?.faceit_raw?.nickname}`}><img src="/faceitlogo.png" className="h-8" /></Link>
                                    {player?.leetify_raw?.bans?.[0]?.platform === "faceit" && (
                                        <div className="text-center bg-red-900/40 text-xs font-bold rounded-b w-full" title={`Banned: ${formatMatchTime(player?.leetify_raw?.bans?.[0]?.banned_since)}`}>Ban</div>
                                    )}
                                </div>
                            :
                                ''
                            }
                            <Link className="hover:bg-neutral-900 p-1 transition rounded" target="_blank" href={player.steam_url}><img className="h-7" src="../steam.svg" /></Link>
                            <Link className="hover:bg-neutral-900 p-1 transition rounded" target="_blank" href={`https://leetify.com/app/profile/${player.id}`}><img className="h-8" src="../leetify_logo.png" /></Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-center justify-between">
                    {player.leetify_raw?.ranks?.premier && (
                        <div className="flex justify-center md:justify-end w-full">
                            <PremierRankBadge rating={player.leetify_raw?.ranks?.premier} />
                        </div>
                    )}
                    {player.faceit_raw !== null && player.faceit_raw?.length !== 0 && (
                        <div className="flex justify-center items-center gap-8 md:gap-4">
                            <Link target="_blank" className="hidden md:block" href={`https://www.faceit.com/en/players/${player.faceit_raw?.nickname}`}>{player.faceit_raw?.nickname}</Link>
                            <div className="flex gap-4 items-center font-bold">
                                <img className="h-7" src={`https://leetify.com/assets/images/rank-icons/faceit${player.faceit_raw?.games?.cs2?.skill_level}.svg`} />
                                <p>{player.faceit_raw?.games?.cs2?.faceit_elo}</p>
                            </div>
                        </div>
                    )}
                    {player.last_synced_at && (
                        <div title={`Manual refresh is limited to once every 30 minutes.`} className="flex gap-2 items-center justify-end text-neutral-500 text-xs text-center">
                            <p>Last synced: <span className="underline">{formatMatchTime(player.last_synced_at)}</span></p>
                            <div className="cursor-pointer"><Info size={14} /></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}