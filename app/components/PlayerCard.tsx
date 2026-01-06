import Link from 'next/link';
import { PremierRankBadge } from '@/app/components/PremierRankBadge';
import { formatMatchTime } from './FormatMatchTime';

export default function PlayerCard({ player }: { player: any }) {
  console.log(player);
  return (
    <div className="md:fixed static left-0 flex justify-center md:border-r border-zinc-900 md:bg-zinc-900/50 md:h-screen overflow-hidden">
      <div className="flex flex-col w-75 my-5">
        <Link href="../" className="md:border-b border-zinc-900 md:px-15 pb-5">
          <img src="../csstatlab-logo.png" />
        </Link>
        <div className="flex flex-col items-center gap-2 md:border-b border-zinc-900 pb-5 my-5">
          <img
            src={player.avatar}
            className="h-25 w-25 rounded border border-neutral-200"
          />
          <div>
            <div className="flex items-center justify-center gap-2">
              {player.country && (
                <img
                  src={`https://flagsapi.com/${player.country}/flat/64.png`}
                  className="h-6"
                />
              )}
              <h3 className="text-xl font-bold text-center break-words max-w-50">
                {player.name}
              </h3>
            </div>
            <p className="text-neutral-400 text-sm text-center mb-3">
              {player.id}
            </p>
            <div className="gap-2 hidden md:flex justify-center items-top">
              <Link
                className="hover:bg-neutral-900 p-1 transition rounded"
                target="_blank"
                href={player.steam_url}
              >
                <img className="h-7" src="../steam.svg" />
              </Link>
              <Link
                className="hover:bg-neutral-900 p-1 transition rounded"
                target="_blank"
                href={`https://leetify.com/app/profile/${player.id}`}
              >
                <img className="h-8" src="../leetify_logo.png" />
              </Link>
              {player?.faceit_raw?.length === 0 ? (
                ''
              ) : (
                <div className="flex flex-col items-center">
                  <Link
                    className="hover:bg-neutral-900 p-1 transition rounded"
                    target="_blank"
                    href={`https://www.faceit.com/en/players/${player?.faceit_raw?.nickname}`}
                  >
                    <img src="/faceitlogo.png" className="h-8" />
                  </Link>
                  {player?.leetify_raw?.bans?.[0]?.platform === 'faceit' && (
                    <div
                      className="text-center bg-red-900/40 text-xs font-bold rounded-b w-full"
                      title={`Banned: ${formatMatchTime(
                        player?.leetify_raw?.bans?.[0]?.banned_since
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
          {player?.faceit_raw !== null && (
            <div className="flex justify-between items-center gap-8 md:gap-4">
              <img
                className="h-7"
                src={`https://leetify.com/assets/images/rank-icons/faceit${player?.faceit_raw?.games?.cs2?.skill_level}.svg`}
              />
              <div className="flex gap-4 items-center font-bold">
                <Link
                  target="_blank"
                  href={`https://www.faceit.com/en/players/${player?.faceit_raw?.nickname}`}
                >
                  {player?.faceit_raw?.nickname}
                </Link>
                <p>{player?.faceit_raw?.games?.cs2?.faceit_elo}</p>
              </div>
            </div>
          )}

          {player.leetify_raw?.ranks?.premier && (
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold">Premier</p>
              <PremierRankBadge rating={player.leetify_raw?.ranks?.premier} />
            </div>
          )}
        </div>

        {player.leetify_raw?.ranks?.competitive && (
          <div className="flex flex-col gap-2 md:px-10">
            {player.leetify_raw?.ranks?.competitive
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
                  <img
                    src={`https://leetify.com/assets/images/rank-icons/matchmaking${m.rank}.png`}
                    className="h-5"
                  />
                </div>
              ))}
          </div>
        )}
        <div className="h-full flex items-end justify-center">
          {player.last_synced_at && (
            <div className="flex gap-2 text-neutral-500 text-xs justify-center mt-10 md:mt-0">
              <p>
                Last synced:{' '}
                <span className="underline">
                  {formatMatchTime(player.last_synced_at)}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
