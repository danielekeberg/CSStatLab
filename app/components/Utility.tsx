import Card from './Card';
import { PackageX, Flame, Zap, Shield } from 'lucide-react';

export default function Utility(player: any) {
  return (
    <div className="my-10">
      <div className="flex gap-3 items-center my-5">
        <p className="text-sm font-bold text-zinc-500 whitespace-nowrap">
          UTILITY & ECOMONIC EFFICIENCY
        </p>
        <div className="w-full h-[1px] bg-zinc-600/80" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <Card
          label="UTILITY LOST ON DEATH"
          value={
            player?.player?.player?.stats?.utility_on_death_avg
              ? `$` +
                (player?.player?.player?.stats?.utility_on_death_avg).toFixed(2)
              : 0
          }
          icon={PackageX}
        />
        <Card
          label="GRENADE DAMAGE PER GAME"
          value={
            player?.player?.player?.stats?.he_foes_damage_avg
              ? (player?.player?.player?.stats?.he_foes_damage_avg).toFixed(1) +
                ` avg`
              : 0
          }
          icon={Flame}
        />
        <Card
          label="FLASH TO KILL PER GAME"
          value={
            player?.player?.player?.stats?.flashbang_leading_to_kill
              ? (player?.player?.player?.stats?.flashbang_leading_to_kill).toFixed(
                  1
                ) + ` avg`
              : 0
          }
          icon={Zap}
        />
        <Card
          label="AVG FLASH DURATION"
          value={
            player?.player?.player?.stats?.flashbang_hit_foe_avg_duration
              ? (player?.player?.player?.stats?.flashbang_hit_foe_avg_duration).toFixed(
                  1
                ) + ` sec`
              : 0
          }
          icon={Shield}
        />
      </div>
    </div>
  );
}
