'use client';
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

export default function NewHeader() {
  const [input, setInput] = useState('');
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
    <div className="hidden py-5 md:flex w-full justify-between">
      <form onSubmit={handleResolve} className="relative md:w-[50%] xl:w-[25%]">
        <input
          type="text"
          className="w-full border border-neutral-700 bg-[#383838]/20 border border-[#383838] rounded p-2 text-sm pl-11 outline-hidden"
          placeholder="Search by Steam ID or nickname..."
          onChange={(e) => setInput(e.target.value)}
        />
        <img src="../search.svg" className="h-8 w-6 absolute top-1 left-3" />
      </form>
      <div>
        <Link target="_blank" href="https://leetify.com">
          <img src="../leetify.png" className="h-11" />
        </Link>
      </div>
    </div>
  );
}
