import Card from './Card';
import { Medal, Swords, TrendingUp, LineChart } from 'lucide-react';

export default function Impact(player: any) {
  return (
    <div className="my-10">
      <div className="flex gap-3 items-center my-5">
        <p className="text-sm font-bold text-zinc-500 whitespace-nowrap">
          IMPACT & RATING
        </p>
        <div className="w-full h-[1px] bg-zinc-600/80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <Card
          label="LEETIFY RATING"
          value={(
            (player?.player?.player?.rating?.ct_leetify * 100 +
              player?.player?.player?.rating?.t_leetify * 100) /
            2
          ).toFixed(2)}
          icon={LineChart}
        />
        <Card
          label="OPENING DUELS"
          value={
            (
              (player?.player?.player?.stats
                ?.ct_opening_duel_success_percentage +
                player?.player?.player?.stats
                  ?.t_opening_duel_success_percentage) /
              2
            ).toFixed(2) + `%`
          }
          icon={Swords}
        />
        <Card
          label="TRADING EFFICIENCY"
          value={
            player?.player?.player?.stats?.trade_kills_success_percentage
              ? (player?.player?.player?.stats?.trade_kills_success_percentage).toFixed(
                  2
                ) + `%`
              : 0
          }
          icon={TrendingUp}
        />
        <Card
          label="CLUTCH CONVERSIONS"
          value={
            player?.player?.player?.rating?.clutch
              ? (player?.player?.player?.rating?.clutch * 100).toFixed(2) + `%`
              : 0
          }
          icon={Medal}
        />
      </div>
    </div>
  );
}
