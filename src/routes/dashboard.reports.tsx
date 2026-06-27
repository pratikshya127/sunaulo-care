import { createFileRoute } from "@tanstack/react-router";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reports — Sunaulo" }] }),
  component: ReportsPage,
});

const days = ["M", "T", "W", "T", "F", "S", "S"];
const mk = (vals: number[]) => days.map((d, i) => ({ d, v: vals[i] }));

const charts = [
  { title: "Blood Pressure", unit: "mmHg", color: "primary", data: mk([120, 122, 118, 125, 121, 119, 123]) },
  { title: "Sugar Level", unit: "mg/dL", color: "teal", data: mk([95, 102, 98, 105, 100, 97, 99]) },
  { title: "Weight", unit: "kg", color: "chart-3", data: mk([68, 68.2, 68.1, 67.9, 68, 68.3, 68.1]) },
  { title: "Sleep", unit: "hrs", color: "chart-4", data: mk([7, 6.5, 7.2, 8, 7.5, 7.8, 7.2]) },
  { title: "Water Intake", unit: "L", color: "teal", data: mk([1.8, 2.0, 1.6, 2.2, 1.9, 2.1, 1.6]) },
  { title: "Medicine Adherence", unit: "%", color: "primary", data: mk([100, 90, 100, 95, 100, 80, 100]) },
];

function ReportsPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Health Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Weekly trends across every vital that matters.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {charts.map((c) => (
          <ChartTile key={c.title} {...c} />
        ))}
      </div>
    </div>
  );
}

function ChartTile({
  title,
  unit,
  color,
  data,
}: {
  title: string;
  unit: string;
  color: string;
  data: { d: string; v: number }[];
}) {
  const latest = data[data.length - 1].v;
  const prev = data[data.length - 2].v;
  const delta = (((latest - prev) / prev) * 100).toFixed(1);
  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft hover:shadow-elevated transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
          <p className="text-3xl font-bold mt-1">
            {latest} <span className="text-base font-normal text-muted-foreground">{unit}</span>
          </p>
        </div>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: `color-mix(in oklab, var(--color-${color}) 15%, transparent)`,
            color: `var(--color-${color})`,
          }}
        >
          {Number(delta) > 0 ? "+" : ""}
          {delta}%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`g-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${color})`} stopOpacity={0.4} />
              <stop offset="100%" stopColor={`var(--color-${color})`} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={11} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: "var(--color-popover)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
            }}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke={`var(--color-${color})`}
            strokeWidth={3}
            fill={`url(#g-${color})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
