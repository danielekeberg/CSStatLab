type ShareStats = {
  id: string;
  name: string;
  aim?: number | null;
  preaim?: number | null;
  timeToDamageMs?: number | null;
  headshotPct?: number | null;
};

export function buildShareText(stats: ShareStats): string {
  const parts: string[] = [];

  parts.push(`https://www.CSStatLab.com/player/${stats.id} ${stats.name}:`);

  if (stats.aim != null) parts.push(`Aim: ${Math.round(stats.aim)}`);
  if (stats.preaim != null) parts.push(`Preaim: ${stats.preaim.toFixed(1)}°`);
  if (stats.timeToDamageMs != null)
    parts.push(`TTD: ${Math.round(stats.timeToDamageMs)}ms`);
  if (stats.headshotPct != null)
    parts.push(`HS%: ${stats.headshotPct.toFixed(1)}%`);

  return parts.join(' • ');
}
