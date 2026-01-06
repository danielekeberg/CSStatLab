'use client';
import { calcAvgAimLast30 } from './AimScore';
import Link from 'next/link';
import { useState } from 'react';

function extractVanity(input: any) {
  try {
    if (input.startsWith('https://steamcommunity.com/profiles/')) {
      const p = new URL(input);
      const parts = p.pathname.split('/').filter(Boolean);
      window.location.href = `../player/${parts[1]}`;
    }
    if (!input.startsWith('https')) {
      return input.trim();
    }
    const u = new URL(input);
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts[0] === 'id' && parts[1]) {
      return parts[1];
    }
    if (parts[0] === 'profiles' && parts[1]) {
      return parts[1];
    }
    return input.trim();
  } catch (err) {
    return input.trim();
  }
}

export default function PlayerOverview({
  player,
  stats,
  matches,
  matchRows,
}: {
  player: any;
  stats: any;
  matches: number;
  matchRows: any[];
}) {
  const [input, setInput] = useState('');
  function getAimCheatChance(rating: number): number {
    if (rating < 90) return 0;
    const x = (rating - 90) / 10;
    const chance = 55.56 * x * x + 55.56 * x;
    return Math.min(100, Number(chance.toFixed(1)));
  }

  function getKdCheatChance(kd: number): number {
    if (kd < 1.7) return 0;
    const maxKD = 2.1;
    const x = (kd - 1.7) / (maxKD - 1.5);
    const chance = 100 * (x * x);
    return Math.min(100, Number(chance.toFixed(1)));
  }

  function getPreaimCheatChance(preaim: number): number {
    if (preaim >= 7) return 0;
    const minPreaim = 5;
    const x = (7 - preaim) / (7 - minPreaim);
    const chance = 100 * (x * x);
    return Math.min(100, Number(chance.toFixed(1)));
  }

  function getTTDCheatChance(ttd: number): number {
    if (ttd >= 500) return 0;
    const minTTD = 400;
    const x = (500 - ttd) / (500 - minTTD);
    const chance = 100 * (x * x);
    return Math.min(100, Number(chance.toFixed(1)));
  }

  function getWinrateCheatChance(winrate: number): number {
    if (winrate < 55) return 0;
    const maxWinrate = 90;
    const x = (winrate - 55) / (maxWinrate - 55);
    const chance = 100 * (x * x);
    return Math.min(100, Number(chance.toFixed(1)));
  }

  function getOverallCheatChance(
    aim: number,
    preaim: number,
    ttd: number,
    kd: number,
    winrate: number
  ): number {
    const aimChance = getAimCheatChance(aim);
    const preaimChance = getPreaimCheatChance(preaim);
    const ttdChance = getTTDCheatChance(ttd);
    const kdChance = getKdCheatChance(kd);
    const wrChance = getWinrateCheatChance(winrate);

    const total = aimChance + preaimChance + ttdChance + kdChance + wrChance;
    const average = total / 5;
    return Number(average.toFixed(1));
  }

  function getCheatRiskLabel(score: number): string {
    if (score <= 10) {
      return 'Very low risk';
    }
    if (score <= 60) {
      return 'Somewhat suspicious';
    }
    return 'Extremely suspicious';
  }
  function getCheatRiskColor(score: number): string {
    if (score <= 10) {
      return '#eae8e0';
    }
    if (score <= 60) {
      return '#f97316';
    }
    return '#ef4444';
  }
  const avgAim = calcAvgAimLast30(matchRows) ?? player.leetify_raw?.rating.aim;
  const score = getOverallCheatChance(
    player?.leetify_raw?.rating?.aim,
    player?.leetify_raw?.stats?.preaim,
    player?.leetify_raw?.stats?.reaction_time_ms,
    stats.kd,
    player?.leetify_raw?.winrate
  );
  const riskText = getCheatRiskLabel(score);
  const handleResolve = async (e: any) => {
    e.preventDefault();
    try {
      const vanity = extractVanity(input);
      const res = await fetch(
        `/api/steam/resolve?vanityurl=${encodeURIComponent(vanity)}`
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data.error || 'Something went wrong');
      } else {
        window.location.href = `../player/${data.steam64id}`;
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="mt-5">
      <div className="hidden py-5 md:flex w-1/3 justify-center">
        <form onSubmit={handleResolve} className="relative w-full">
          <input
            type="text"
            className="w-full border border-neutral-700 bg-[#383838]/20 border border-[#383838] rounded-md p-2 text-sm pl-11 outline-hidden"
            placeholder="Search by Steam ID or nickname..."
            onChange={(e) => setInput(e.target.value)}
          />
          <img src="../search.svg" className="h-8 w-6 absolute top-1 left-3" />
        </form>
      </div>
      <div className="flex gap-3 items-center my-5">
        <p className="text-sm font-bold text-zinc-500 w-70 md:w-50">
          PRIMARY STATISTICS
        </p>
        <div className="w-full h-[1px] bg-zinc-600/80" />
      </div>
      {player.leetify_raw ? (
        <div className="mb-5">
          <div className="grid mb-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {stats?.kd !== null && (
              <div className="bg-zinc-900/50 border border-[#383838] rounded-xl p-5 flex items-center md:items-start flex-col gap-3">
                <div className="bg-[#07a4f1]/15 p-2 rounded-md w-fit">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.4167 14.1667L10 13.3334L9.58337 14.1667H10.4167Z"
                      stroke="#07A4F1"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.5 18.3334C12.7211 18.3334 12.933 18.2456 13.0893 18.0893C13.2456 17.933 13.3334 17.721 13.3334 17.5V16.6667C13.6473 16.6665 13.9548 16.5776 14.2204 16.4104C14.486 16.2431 14.699 16.0042 14.8349 15.7212C14.9707 15.4382 15.0239 15.1226 14.9882 14.8108C14.9526 14.4989 14.8296 14.2034 14.6334 13.9584C15.5884 13.0353 16.2458 11.848 16.5215 10.5487C16.7972 9.24945 16.6785 7.89746 16.1807 6.66611C15.6828 5.43476 14.8285 4.38018 13.7273 3.6376C12.6261 2.89502 11.3282 2.49829 10 2.49829C8.67186 2.49829 7.37395 2.89502 6.27275 3.6376C5.17154 4.38018 4.31725 5.43476 3.81941 6.66611C3.32157 7.89746 3.20288 9.24945 3.47857 10.5487C3.75425 11.848 4.41173 13.0353 5.36671 13.9584C5.17052 14.2034 5.04751 14.4989 5.01187 14.8108C4.97622 15.1226 5.02937 15.4382 5.16521 15.7212C5.30105 16.0042 5.51405 16.2431 5.77969 16.4104C6.04532 16.5776 6.3528 16.6665 6.66671 16.6667V17.5C6.66671 17.721 6.75451 17.933 6.91079 18.0893C7.06707 18.2456 7.27903 18.3334 7.50004 18.3334H12.5Z"
                      stroke="#07A4F1"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.5 10.8333C12.9602 10.8333 13.3333 10.4602 13.3333 9.99996C13.3333 9.53972 12.9602 9.16663 12.5 9.16663C12.0397 9.16663 11.6666 9.53972 11.6666 9.99996C11.6666 10.4602 12.0397 10.8333 12.5 10.8333Z"
                      stroke="#07A4F1"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7.49996 10.8333C7.9602 10.8333 8.33329 10.4602 8.33329 9.99996C8.33329 9.53972 7.9602 9.16663 7.49996 9.16663C7.03972 9.16663 6.66663 9.53972 6.66663 9.99996C6.66663 10.4602 7.03972 10.8333 7.49996 10.8333Z"
                      stroke="#07A4F1"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-[#b3c0d3] text-xs font-bold">K/D RATIO</p>
                <h1 className="text-[#eae8e0] font-bold text-2xl">
                  {stats.kd != null ? stats.kd.toFixed(2) : 'Not enough data'}
                </h1>
              </div>
            )}
            <div className="bg-zinc-900/50 border border-[#383838] rounded-xl p-5 flex flex-col items-center md:items-start gap-3">
              <div className="bg-[#07a4f1]/15 p-2 rounded-md w-fit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.99996 18.3333C14.6023 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6023 1.66663 9.99996 1.66663C5.39759 1.66663 1.66663 5.39759 1.66663 9.99996C1.66663 14.6023 5.39759 18.3333 9.99996 18.3333Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.3333 10H15"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.99996 10H1.66663"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 4.99996V1.66663"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 18.3333V15"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[#b3c0d3] text-xs font-bold">AIM</p>
              <h1 className="text-[#eae8e0] font-bold text-2xl">
                {player.leetify_raw.rating.aim.toFixed(1)}
              </h1>
            </div>
            <div className="bg-zinc-900/50 border border-[#383838] rounded-xl p-5 flex flex-col items-center md:items-start gap-3">
              <div className="bg-[#07a4f1]/15 p-2 rounded-md w-fit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.99996 18.3333C14.6023 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6023 1.66663 9.99996 1.66663C5.39759 1.66663 1.66663 5.39759 1.66663 9.99996C1.66663 14.6023 5.39759 18.3333 9.99996 18.3333Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11.6667C10.9205 11.6667 11.6667 10.9205 11.6667 10C11.6667 9.07957 10.9205 8.33337 10 8.33337C9.07957 8.33337 8.33337 9.07957 8.33337 10C8.33337 10.9205 9.07957 11.6667 10 11.6667Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[#b3c0d3] text-xs font-bold">PREAIM</p>
              <h1 className="text-[#eae8e0] font-bold text-2xl">
                {player?.leetify_raw?.stats?.preaim
                  ? `${player?.leetify_raw?.stats?.preaim.toFixed(1)}°`
                  : 'Not enough data'}
              </h1>
            </div>
            <div className="bg-zinc-900/50 border border-[#383838] rounded-xl p-5 flex flex-col items-center md:items-start gap-3">
              <div className="bg-[#07a4f1]/15 p-2 rounded-md w-fit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.33325 1.66663H11.6666"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11.6666L12.5 9.16663"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9.99992 18.3333C13.6818 18.3333 16.6666 15.3486 16.6666 11.6667C16.6666 7.98477 13.6818 5 9.99992 5C6.31802 5 3.33325 7.98477 3.33325 11.6667C3.33325 15.3486 6.31802 18.3333 9.99992 18.3333Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[#b3c0d3] text-xs font-bold">TIME TO DAMAGE</p>
              <h1 className="text-[#eae8e0] font-bold text-2xl">
                {player?.leetify_raw?.stats?.reaction_time_ms
                  ? `${player?.leetify_raw?.stats?.reaction_time_ms.toFixed(
                      1
                    )}ms`
                  : 'Not enough data'}
              </h1>
            </div>
            <div className="bg-zinc-900/50 border border-[#383838] rounded-xl p-5 flex flex-col items-center md:items-start gap-3">
              <div className="bg-[#07a4f1]/15 p-2 rounded-md w-fit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.99996 18.3333C14.6023 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6023 1.66663 9.99996 1.66663C5.39759 1.66663 1.66663 5.39759 1.66663 9.99996C1.66663 14.6023 5.39759 18.3333 9.99996 18.3333Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 11.6667C10.9205 11.6667 11.6667 10.9205 11.6667 10C11.6667 9.07957 10.9205 8.33337 10 8.33337C9.07957 8.33337 8.33337 9.07957 8.33337 10C8.33337 10.9205 9.07957 11.6667 10 11.6667Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[#b3c0d3] text-xs font-bold">
                HEADSHOT ACCURACY
              </p>
              <h1 className="text-[#eae8e0] font-bold text-2xl">
                {player?.leetify_raw?.stats?.accuracy_head
                  ? `${player?.leetify_raw?.stats?.accuracy_head.toFixed(1)}%`
                  : 'Not enough data'}
              </h1>
            </div>
            <div className="bg-zinc-900/50 border border-[#383838] rounded-xl p-5 flex flex-col items-center md:items-start gap-3">
              <div className="bg-[#07a4f1]/15 p-2 rounded-md w-fit">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.8334 4.16663L4.16675 15.8333"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.41659 7.50004C6.56718 7.50004 7.49992 6.5673 7.49992 5.41671C7.49992 4.26611 6.56718 3.33337 5.41659 3.33337C4.26599 3.33337 3.33325 4.26611 3.33325 5.41671C3.33325 6.5673 4.26599 7.50004 5.41659 7.50004Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14.5833 16.6667C15.7339 16.6667 16.6667 15.7339 16.6667 14.5833C16.6667 13.4327 15.7339 12.5 14.5833 12.5C13.4327 12.5 12.5 13.4327 12.5 14.5833C12.5 15.7339 13.4327 16.6667 14.5833 16.6667Z"
                    stroke="#07A4F1"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-[#b3c0d3] text-xs font-bold">WIN RATE</p>
              <h1 className="text-[#eae8e0] font-bold text-2xl">
                {player?.leetify_raw?.winrate
                  ? `${(player?.leetify_raw?.winrate * 100).toFixed(1)}%`
                  : 'Not enough data'}
              </h1>
            </div>
          </div>
          <div className="flex justify-end">
            <Link target="_blank" href="https://leetify.com">
              <img src="../leetify.png" className="h-11" />
            </Link>
          </div>
        </div>
      ) : (
        <p>
          We couldn’t find this player on Leetify. Showing available Steam data
          instead.
        </p>
      )}
    </div>
  );
}
