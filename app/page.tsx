'use client';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { useState } from 'react';
import Link from 'next/link';
import Snowfall from 'react-snowfall';

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

export default function Home() {
  const [input, setInput] = useState('');
  const [steamId, setSteamId] = useState('');

  const handleResolve = async (e: any) => {
    e.preventDefault();
    setSteamId('');
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
    <div className="relative px-5 md:px-[15%]">
      <Header status={false} />
      <div className="flex justify-center">
        <div className="w-160 text-center pt-10 pb-20 md:py-30">
          <div className="hidden mb-5 rounded-xs md:flex flex-col gap-2 p-5">
            <div className="flex justify-center items-center opacity-80">
              <Link
                target="_blank"
                href="https://steamwcommunity.com/id/danir2x/"
                className="hover:bg-white/5 transition bg-neutral-900/30 px-3 text-[#b3c0d3] rounded-full mb-2 border border-[#eae8e0] w-fit py-2"
              >
                https://steam
                <span className="text-[#0fa4f1] font-bold underline">w</span>
                community.com/id/danir2x/
              </Link>
            </div>
            <p className="text-[#b3c0d3]">
              Simply add a <span className="text-[#0fa4f1]">“W”</span> between{' '}
              <span className="text-[#0fa4f1]">steam</span> and{' '}
              <span className="text-[#0fa4f1]">community</span> in the URL to
              view your own or other players’ CS stats.
            </p>
          </div>
          <div>
            <h1 className="text-5xl mb-2">Master Your Game with</h1>
            <div className="flex justify-center">
              <h1 className="text-5xl mb-2 py-2 px-4border border-[#0fa4f1] text-[#0fa4f1] w-fit">
                Precision Stats
              </h1>
            </div>
          </div>
          <p className="text-[#b3c0d3] my-5">
            Track your CS2 performance, analyze your gameplay, and climb the
            ranks with detailed statistics, fairplay insights, and performance
            trends.
          </p>
          <form onSubmit={handleResolve} className="relative">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              className="w-full border border-[#eae8e0] rounded-full p-3 pl-11 outline-hidden"
              placeholder="Enter your steam ID, or username"
            />
            <img
              src="../search.svg"
              className="h-6 w-6 opacity-70 absolute top-3 left-3"
            />
          </form>
          <div className="flex gap-2 mt-10 justify-center">
            <p className="font-bold">Try:</p>
            <div className="grid text-[#b3c0d3] grid-cols-3 text-left md:text-center gap-3 md:gap-3 md:grid-cols-6">
              <Link
                href={`../player/76561198369432059`}
                className="hover:underline text-center cursor-pointer"
              >
                danir
              </Link>
              <Link
                href={`../player/76561198386265483`}
                className="hover:underline text-center cursor-pointer"
              >
                donk
              </Link>
              <Link
                href={`../player/76561198074762801`}
                className="hover:underline text-center cursor-pointer"
              >
                m0NESY
              </Link>
              <Link
                href={`../player/76561198113666193`}
                className="hover:underline text-center cursor-pointer"
              >
                ZywOo
              </Link>
              <Link
                href={`../player/76561198041683378`}
                className="hover:underline text-center cursor-pointer"
              >
                NiKo
              </Link>
              <Link
                href={`../player/76561198176878303`}
                className="hover:underline text-center cursor-pointer"
              >
                jL
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
