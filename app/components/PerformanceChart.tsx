"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PerformanceChart({ data }: { data: any }) {
    const chartData = data.map((d:any) => ({
        date: new Date(d.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
        }),
        rating: Number(d.avg_rating),
    }));

    return (
        <div className="h-80">
            <h5 className="font-bold mb-2">Performance Trend</h5>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(v: number) => v.toFixed(1)} />
                        <Line
                            type="monotone"
                            dataKey="rating"
                            stroke="eae8e0"
                            strokeWidth={2}
                        />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}