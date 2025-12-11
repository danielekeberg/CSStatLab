'use client';
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";

function extractVanity(input:any) {
  try {
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
        setSteamId(data.steam64id);
      }
    } catch(err) {
      console.error(err);
    } finally {
      // window.location.href = `../player/${steamId}`
      console.log(steamId)
    }
  }

  return (
      <div className="md:px-[15%] px-5 relative">
        <Header />
        <div className="flex justify-center">
          <div className="w-120 text-center py-50">
            <h1 className="text-5xl mb-2">Player analytics for competitive CS2</h1>
            <p className="text-[#eae8e0]">Detailed performance insights, aim analysis, and integrity metrics.</p>
            <p className="text-[#eae8e0] mb-10">Built for serious players, coaches, and analysts.</p>
            <form onSubmit={handleResolve} className="relative">
              <input type="text" onChange={(e) => setInput(e.target.value)} className="w-full border border-[#eae8e0] rounded-xl p-3 pl-11 outline-hidden" placeholder="Search by Steam ID or nickname..." />
              <img src="./search.svg" className="h-6 w-6 absolute top-3 left-3" />
            </form>
            <div className="flex gap-2 mt-10">
              <p>Try:</p>
              <div className="grid grid-cols-3 text-left md:text-center gap-3 md:gap-0 md:grid-cols-7">
                <Link href="../player/76561198369432059" className="hover:underline cursor-pointer font-bold">danir</Link>
                <Link href="../player/76561198054218088" className="hover:underline cursor-pointer font-bold">conedre</Link>
                <Link href="../player/76561198107958587" className="hover:underline cursor-pointer font-bold">edoba</Link>
                <Link href="../player/76561198082787961" className="hover:underline cursor-pointer font-bold">gilbert</Link>
                <Link href="../player/76561198073603563" className="hover:underline cursor-pointer font-bold">pondus</Link>
                <Link href="../player/76561198091732016" className="hover:underline cursor-pointer font-bold">rappen</Link>
                <Link href="../player/76561198386265483" className="hover:underline cursor-pointer font-bold">donk</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-10">
          <div className="flex flex-col gap-2">
            <img />
            <h5 className="font-bold">Performance Trends</h5>
            <p className="text-sm">Track K/D, winrate, ADR, and more over time with detailed historical analysis.</p>
          </div>
          <div className="flex flex-col gap-2">
            <img />
            <h5 className="font-bold">Aim Analytics</h5>
            <p className="text-sm">Analyze crosshair placement, spray control, and reaction times per weapon.</p>
          </div>
          <div className="flex flex-col gap-2">
            <img />
            <h5 className="font-bold">Map Insights</h5>
            <p className="text-sm">Understand your strength and weaknesses across all active duty maps.</p>
          </div>
          <div className="flex flex-col gap-2">
            <img />
            <h5 className="font-bold">Integrity Analysis</h5>
            <p className="text-sm">Statistical anomaly detection with transparent, research-grade methodology.</p>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-200 text-center py-50">
            <h1 className="text-3xl mb-2">Trusted by analysts worldwide</h1>
            <p>Comprehensive data from official sources</p>
            <div className="grid grid-cols-4 mt-10">
              <div>
                <h4 className="text-2xl font-bold">2M+</h4>
                <p>Players tracked</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">50M+</h4>
                <p>Matches analyzed</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">99.9%</h4>
                <p>Uptime</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold">{`<1s`}</h4>
                <p>Data refresh</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
  );
}