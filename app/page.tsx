'use client';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";

function extractVanity(input:any) {
  try {
    if(input.startsWith("https://steamcommunity.com/profiles/")) {
      const p = new URL(input);
      const parts = p.pathname.split("/").filter(Boolean);
      window.location.href = `../player/${parts[1]}`;
    }
    if(!input.startsWith("https")) {
      return input.trim();
    }
    const u = new URL(input);
    const parts = u.pathname.split("/").filter(Boolean);
    if(parts[0] === "id" && parts[1]) {
      return parts[1];
    }

    if(parts[0] === "profiles" && parts[1]) {
      return parts[1];
    }

    return input.trim();
  } catch(err) {
    return input.trim();
  }
}

export default function Home() {
  const [input, setInput] = useState("");
  const [steamId, setSteamId] = useState("");

  const handleResolve = async (e:any) => {
    e.preventDefault();
    setSteamId("");
    try {
      const vanity = extractVanity(input);
      const res = await fetch(`/api/steam/resolve?vanityurl=${encodeURIComponent(vanity)}`);
      const data = await res.json();
      if(!res.ok) {
        console.error(data.error || "Something went wrong")
      } else {
        window.location.href = `../player/${data.steam64id}`
      }
    } catch(err) {
      console.error(err);
    }
  }

  return (
      <div className="md:px-[15%] px-5 relative">
        <Header status={false} />
        <div className="flex justify-center">
          <div className="w-120 text-center pt-10 pb-20 md:py-30">
            <div className="mb-10 rounded-xs flex flex-col gap-2 p-5">
              <Link target="_blank" href="https://steamwcommunity.com/id/danir2x/" className="hover:bg-white/5 transition bg-neutral-900/30 p-1 rounded mb-2 border border-[#eae8e0] text-xl">https://steam<span className="text-yellow-500 font-bold text-2xl">w</span>community.com/id/danir2x/</Link>
              <p className="text-sm">Simply add a “W” between <span className="bg-neutral-900/30 px-1 rounded border border-yellow-500/70">steam</span> and <span className="bg-neutral-900/30 px-1 rounded border border-yellow-500/70">community</span> in the URL to view your own or other players’ CS stats.</p>
            </div>
            <h1 className="text-5xl mb-2">Player analytics for competitive CS2</h1>
            <p className="text-[#eae8e0]">Detailed performance insights, aim analysis, and integrity metrics.</p>
            <p className="text-[#eae8e0] mb-10">Built for serious players, coaches, and analysts.</p>
            <form onSubmit={handleResolve} className="relative">
              <input type="text" onChange={(e) => setInput(e.target.value)} className="w-full border border-[#eae8e0] rounded-xl p-3 pl-11 outline-hidden" placeholder="Search by Steam ID or nickname..." />
              <img src="../search.svg" className="h-6 w-6 absolute top-3 left-3" />
            </form>
            <div className="flex gap-2 mt-10 justify-center">
              <p>Try:</p>
              <div className="grid grid-cols-3 text-left md:text-center gap-3 md:gap-3 md:grid-cols-6">
                <Link href="../player/76561198369432059" className="hover:underline text-center cursor-pointer font-bold">danir</Link>
                <Link href="../player/76561198386265483" className="hover:underline text-center cursor-pointer font-bold">donk</Link>
                <Link href="../player/76561198074762801" className="hover:underline text-center cursor-pointer font-bold">m0NESY</Link>
                <Link href="../player/76561198113666193" className="hover:underline text-center cursor-pointer font-bold">ZywOo</Link>
                <Link href="../player/76561198041683378" className="hover:underline text-center cursor-pointer font-bold">NiKo</Link>
                <Link href="../player/76561198176878303" className="hover:underline text-center cursor-pointer font-bold">jL</Link>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
}