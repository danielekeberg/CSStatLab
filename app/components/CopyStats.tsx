'use client';

import { useState } from 'react';
import { buildShareText } from '@/lib/buildShareText';

type Props = {
  id: string;
  name: string;
  aim?: number;
  preaim?: number;
  timeToDamageMs?: number;
  headshotPct?: number;
};

export function CopyStatsButton(props: Props) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    try {
      const text = buildShareText(props);
      await navigator.clipboard.writeText(text);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="bg-zinc-900 cursor-pointer text-zinc-400 text-xs font-bold py-1 px-2 rounded border border-zinc-800 hover:border-emerald-500/20 transition-all hover:text-zinc-300 duration-200"
    >
      {copied ? 'Copied ✓' : 'Copy Stats'}
    </button>
  );
}
