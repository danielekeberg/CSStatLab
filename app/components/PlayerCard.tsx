'use client';

import Link from 'next/link';
import { PremierRankBadge } from '@/app/components/PremierRankBadge';
import { formatMatchTime } from './FormatMatchTime';
import { useState } from 'react';

function result(wins: any, loss: any) {
  if (wins === loss) {
    return 'bg-zinc-500';
  }
  if (wins > loss) {
    return 'bg-emerald-500';
  }
  if (wins < loss) {
    return 'bg-rose-500';
  }
}

export default function PlayerCard({ player }: { player: any }) {
  const [hover, setHover] = useState(false);
  return (
    <div className="md:fixed overflow-y-scroll static left-0 flex justify-center md:border-r border-zinc-900 md:bg-zinc-900/50 md:h-screen overflow-hidden">
      <div className="flex flex-col w-75 my-5">
        <Link href="../" className="md:border-b border-zinc-900 md:px-15 pb-5">
          <img src="../csstatlab-logo.png" />
        </Link>
        <div className="flex flex-col items-center gap-2 md:border-b border-zinc-900 pb-5 my-5">
          <img
            src={player?.steam?.response?.players?.[0].avatarfull}
            className="h-25 w-25 rounded border border-neutral-200"
          />
          <div>
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-xl font-bold text-center break-words max-w-50">
                {player?.steam?.response?.players?.[0].personaname}
              </h3>
            </div>
            <p className="text-neutral-400 text-sm text-center mb-3">
              {player?.steam?.response?.players?.[0].steamid}
            </p>
            <div className="gap-2 flex justify-center">
              {player?.flags.hasSteam && (
                <Link
                  className="hover:bg-neutral-900 p-1 transition rounded"
                  target="_blank"
                  href={player?.steam?.response?.players?.[0].profileurl}
                >
                  <img className="h-7" src="../steam.svg" />
                </Link>
              )}
              {player?.flags.hasLeetify && (
                <Link
                  className="hover:bg-neutral-900 p-1 transition rounded"
                  target="_blank"
                  href={`https://leetify.com/app/profile/${player?.steam?.response?.players?.[0].steamid}`}
                >
                  <img className="h-8" src="../leetify_logo.png" />
                </Link>
              )}
              {player?.flags.hasFaceit && (
                <div className="flex flex-col items-center">
                  <Link
                    className="hover:bg-neutral-900 p-1 transition rounded"
                    target="_blank"
                    href={`https://www.faceit.com/en/players/${player?.faceit?.nickname}`}
                  >
                    <img src="/faceitlogo.png" className="h-8" />
                  </Link>
                  {player?.player?.bans?.[0]?.platform === 'faceit' && (
                    <div
                      className="text-center bg-red-900/40 text-xs font-bold rounded-b w-full"
                      title={`Banned: ${formatMatchTime(
                        player?.player?.bans?.[0]?.banned_since
                      )}`}
                    >
                      Ban
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 my-10 md:my-0 px-15 pb-5">
          {player?.flags.hasFaceit && (
            <div className="flex justify-between items-center gap-8 md:gap-4">
              <img
                className="h-7"
                src={`https://leetify.com/assets/images/rank-icons/faceit${player?.faceit?.games?.cs2?.skill_level}.svg`}
              />
              <div className="flex gap-4 items-center font-bold">
                <Link
                  target="_blank"
                  className="hover:underline"
                  href={`https://www.faceit.com/en/players/${player?.faceit?.nickname}`}
                >
                  {player?.faceit?.nickname}
                </Link>
                <p>{player?.faceit?.games?.cs2?.faceit_elo}</p>
              </div>
            </div>
          )}

          {player?.player?.ranks?.premier && (
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold">Premier</p>
              <PremierRankBadge rating={player?.player?.ranks?.premier} />
            </div>
          )}
        </div>
        <div
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="pb-10"
        >
          {player?.player?.ranks?.competitive && (
            <div className="flex flex-col gap-2 md:px-10">
              {player?.player?.ranks?.competitive
                .filter((m: any) => m.rank > 0)
                .sort((a: any, b: any) => b.rank - a.rank)
                .map((m: any, i: any) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://leetify.com/assets/images/map-icons/${m.map_name}.svg`}
                        className="h-7"
                      />
                      <p className="font-bold text-sm">
                        {m.map_name.slice(3, 4).toUpperCase()}
                        {m.map_name.slice(4)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {player?.errors?.leetifyMatches?.status === 404 ? (
                        <img
                          src={`https://leetify.com/assets/images/rank-icons/matchmaking${m.rank}.png`}
                          className="h-5"
                        />
                      ) : (
                        <>
                          {!hover ? (
                            <img
                              src={`https://leetify.com/assets/images/rank-icons/matchmaking${m.rank}.png`}
                              className="h-5"
                            />
                          ) : (
                            <>
                              {player?.recentMatches
                                .filter((ma: any) => ma.map_name === m.map_name)
                                .slice(0, 5)
                                .map((match: any) => (
                                  <div
                                    key={match.id}
                                    className={`${result(
                                      match.stats[0].rounds_won,
                                      match.stats[0].rounds_lost
                                    )} h-2 w-2 rounded-full`}
                                  />
                                ))}
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
