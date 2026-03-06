"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartPoint = { epoch: number; v1?: number; v2?: number; v3?: number };

export default function AccuracyChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-surface-800/50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-200">
        MSE over training runs
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="epoch"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
            />
            <YAxis
              domain={[0, "dataMax"]}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#475569" }}
              tickFormatter={(v) => Number(v).toFixed(3)}
            />
            <Tooltip
              contentStyle={{
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value: number) => [Number(value).toFixed(4), ""]}
            />
            <Legend
              wrapperStyle={{ paddingTop: 8 }}
              formatter={(value) => <span className="text-slate-300">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="v1"
              name="Version 1"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 3 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="v2"
              name="Version 2"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: "#8b5cf6", r: 3 }}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="v3"
              name="Version 3"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: "#22c55e", r: 3 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
