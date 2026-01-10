'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import NewHeader from '@/app/components/NewHeader';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Loader from '@/app/components/Loader';
import PlayerOverview from '@/app/components/NewPlayerOverview';
import PlayerCard from '@/app/components/PlayerCard';
import Impact from '@/app/components/Impact';
import Utility from '@/app/components/Utility';
import Overview from '@/app/components/Overview';
import Ads from '@/app/components/Ad';
import PerformanceChart from '@/app/components/PerformanceChart';
import RecentMatches from '@/app/components/RecentMatches';
import Ranks from '@/app/components/Ranks';
import Affiliate from '@/app/components/Affiliate';

type Player = {
  id: string;
  name: string;
  avatar: string | null;
  country: string | null;
  last_synced_at: string | null;
  leetify_raw: any[] | null;
};

type Stats = {
  accuracy: number;
  kd: number;
  matchesPlayed: number;
  matchesWon: number;
  preaim: number;
  ttd: number;
  winrate: number;
};

type ApiPlayerData = {
  player: Player | null;
  stats: Stats | null;
  recentMatchStats: any[];
  notification: any[];
};

export default function PlayerPage() {
  const params = useParams<{ id: string }>();
  const steam64 = params.id;

  const [loading, setLoading] = useState(true);

  const [testPlayer, setTestPlayer] = useState<any | null>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentMatchStats, setRecentMatchStats] = useState<any[]>([]);
  const [matchesLength, setMatchesLength] = useState(0);

  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');

  async function fetchTest(id: string) {
    const res = await fetch(`/api/player/${id}/test`, {
      method: 'GET',
    });
    if (!res.ok) {
      console.error('Erorr fetching');
    }
    const data = await res.json();
    return data;
  }

  useEffect(() => {
    async function loadPlayer() {
      try {
        setLoading(true);
        const data = await fetchTest(steam64);
        setTestPlayer(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPlayer();
  }, [steam64]);

  if (loading) {
    return (
      <div className="relative px-5 md:px-[15%]">
        <Header status={false} />
        <div className="h-[70vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <p className="text-sm text-white/70">
              Syncing profile… this can take a few seconds.
            </p>
            <p className="text-xs text-white/50">
              We&apos;re fetching your latest matches and stats.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-5">
      <div className="relative">
        <div className="md:flex h-screen gap-20 md:pl-90 md:pr-15">
          {testPlayer && <PlayerCard player={testPlayer} />}

          <div className="w-full">
            <div className="min-h-[85vh]">
              {testPlayer && (
                <>
                  <NewHeader />
                  {testPlayer.player ? (
                    <>
                      <Overview player={testPlayer} />
                      <PlayerOverview player={testPlayer} />
                      <Impact player={testPlayer} />
                      <Utility player={testPlayer} />
                      <Ads />
                    </>
                  ) : (
                    <div className="py-20 w-full flex items-center justify-center">
                      <p>No data available.</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
