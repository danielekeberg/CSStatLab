'use client';
import { calcAvgAimLast30 } from './AimScore';
import Link from 'next/link';
import Card from './Card';
import { useState } from 'react';
import { Target, Crosshair, Clock, Skull } from 'lucide-react';

export default function PlayerOverview({ player }: { player: any }) {
  const [input, setInput] = useState('');
  return (
    <div className="mt-5">
      <div className="flex gap-3 items-center my-5">
        <p className="text-sm font-bold text-zinc-500 whitespace-nowrap">
          AIM & DUEL
        </p>
        <div className="w-full h-[1px] bg-zinc-600/80" />
      </div>
      <div className="mb-5">
        <div className="grid mb-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <Card
            label="AIM"
            value={
              player?.player?.rating?.aim
                ? (player?.player?.rating?.aim).toFixed(1)
                : 0
            }
            icon={Target}
          />
          <Card
            label="PREAIM"
            value={
              player?.player?.stats?.preaim
                ? (player?.player?.stats?.preaim).toFixed(2) + `°`
                : 0
            }
            icon={Crosshair}
          />
          <Card
            label="TIME TO DAMAGE"
            value={
              player?.player?.stats?.reaction_time_ms
                ? (player?.player?.stats?.reaction_time_ms).toFixed(0) + `ms`
                : 0
            }
            icon={Clock}
          />
          <Card
            label="HEADSHOT %"
            value={
              player?.player?.stats?.accuracy_head
                ? (player?.player?.stats?.accuracy_head).toFixed(2) + `%`
                : 0
            }
            icon={Skull}
          />
        </div>
      </div>
    </div>
  );
}
