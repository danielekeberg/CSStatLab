"use client";

import { useMemo, useState } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";

    type MatchRow = {
        finished_at: string | null;
        total_kills: number | null;
        total_deaths: number | null;
        kd_ratio: number | null;
        preaim: number | null;
        reaction_time_ms: number | null;
        accuracy: number | null;
        rounds_won: number | null;
        rounds_lost: number | null;
    };

    function formatDateLabel(iso: string) {
        const d = new Date(iso);
        return d.toLocaleDateString(undefined, { month: "short", day: "2-digit" });
    }

    function mapMatchStatsToChart(rows: MatchRow[]) {
    return rows
        .filter((r) => r.finished_at)
        .map((r) => {
        const kd =
            typeof r.kd_ratio === "number"
            ? r.kd_ratio
            : typeof r.total_kills === "number" &&
                typeof r.total_deaths === "number" &&
                r.total_deaths > 0
            ? r.total_kills / r.total_deaths
            : null;

        const win =
            typeof r.rounds_won === "number" && typeof r.rounds_lost === "number"
            ? r.rounds_won > r.rounds_lost
                ? 1
                : 0
            : null;

        return {
            date: formatDateLabel(r.finished_at!),
            ts: new Date(r.finished_at!).getTime(),
            kd: kd !== null ? Number(kd.toFixed(2)) : null,
            preaim: typeof r.preaim === "number" ? Number(r.preaim.toFixed(2)) : null,
            ttd:
            typeof r.reaction_time_ms === "number"
                ? Number(r.reaction_time_ms.toFixed(0))
                : null,
            accuracy:
            typeof r.accuracy === "number"
                ? Number((r.accuracy * 100).toFixed(1))
                : null,
            win,
        };
        })
        .sort((a, b) => a.ts - b.ts);
    }

    type MetricKey = "kd" | "preaim" | "ttd" | "accuracy";

    const metricMeta: Record<
        MetricKey,
        { label: string; unit?: string; domain?: [number, number] }
        > = {
        kd: { label: "KD", unit: "" },
        preaim: { label: "Pre-aim", unit: "" },
        ttd: { label: "Time to Damage", unit: "ms" },
        accuracy: { label: "Accuracy", unit: "%" },
    };

    export default function PerformanceChart({rows,}: { rows: MatchRow[]; }) {
    const [metric, setMetric] = useState<MetricKey>("kd");

    const data = useMemo(() => mapMatchStatsToChart(rows), [rows]);
    const filtered = useMemo(
        () => data.filter((d) => typeof d[metric] === "number"),
        [data, metric]
    );

    return (
        <div className="w-full rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                    <div className="text-sm text-white/60">Performance chart (30 days)</div>
                        <div className="text-lg font-semibold text-white">
                            {metricMeta[metric].label}
                        </div>
                    </div>

                    <select
                        className="rounded border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white outline-none"
                        value={metric}
                        onChange={(e) => setMetric(e.target.value as MetricKey)}
                        >
                        <option value="kd">KD</option>
                        <option value="preaim">Pre-aim</option>
                        <option value="ttd">Time to Damage (ms)</option>
                        <option value="accuracy">Accuracy (%)</option>
                    </select>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filtered} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eae8e040" />
                        <XAxis dataKey="date" tickMargin={10} fontSize={15} />
                        <YAxis
                        tickMargin={1}
                        width={50}
                        fontSize={15}
                        />
                        <Line
                        type="monotone"
                        dataKey={metric}
                        strokeWidth={2}
                        dot={false}
                        activeDot={false}
                        isAnimationActive={false}
                        stroke="#eae8e0"
                        filter="drop-shadow(0 0 6px #eae8e059)"
                        />
                    </LineChart>
                    </ResponsiveContainer>
                </div>

            {filtered.length === 0 && (
                <div className="mt-3 text-sm text-white/60">
                Not enough data to render this metric yet.
                </div>
            )}
        </div>
    );
}