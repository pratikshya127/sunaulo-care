import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  Pill,
  Gauge,
  Sparkles,
  Moon,
  Droplets,
  Weight,
  HeartPulse,
  Activity,
  Bell,
  Check,
  Clock,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
} from "lucide-react";
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
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Sunaulo" },
      { name: "description", content: "Daily vitals, medicine, and alerts at a glance." },
    ],
  }),
  component: DashboardHome,
});

const bpData = [
  { d: "Mon", sys: 120, dia: 80 },
  { d: "Tue", sys: 122, dia: 82 },
  { d: "Wed", sys: 118, dia: 78 },
  { d: "Thu", sys: 125, dia: 84 },
  { d: "Fri", sys: 121, dia: 80 },
  { d: "Sat", sys: 119, dia: 79 },
  { d: "Sun", sys: 123, dia: 81 },
];
const adherence = [
  { d: "Mon", v: 100 },
  { d: "Tue", v: 90 },
  { d: "Wed", v: 100 },
  { d: "Thu", v: 95 },
  { d: "Fri", v: 100 },
  { d: "Sat", v: 80 },
  { d: "Sun", v: 100 },
];

function DashboardHome() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <Greeting />
      <VitalsGrid />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Blood Pressure" subtitle="Last 7 days · mmHg">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={bpData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sys"
                  stroke="var(--color-primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-primary)" }}
                />
                <Line
                  type="monotone"
                  dataKey="dia"
                  stroke="var(--color-teal)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "var(--color-teal)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Medicine Compliance" subtitle="This week">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={adherence}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="v" fill="var(--color-primary)" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div className="space-y-6">
          <UpcomingMedicine />
          <EmergencyStatus />
          <RecentNotifications />
        </div>
      </div>
    </div>
  );
}

function Greeting() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const subtitles: Record<string, string> = {
    elderly: "Here are your medicines and health summary for today.",
    caregiver: "Here's an overview of the patients in your care.",
    family: "Here's how your loved one is doing today.",
  };
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
          {greeting}, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {subtitles[user?.role ?? "family"]}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> All vitals normal
      </div>
    </div>
  );
}

function VitalsGrid() {
  const vitals = [
    { icon: Pill, label: "Today's Medicines", value: "4/5", sub: "1 upcoming", tone: "primary", trend: null },
    { icon: Gauge, label: "Blood Pressure", value: "121/80", sub: "Normal", tone: "teal", trend: "down" },
    { icon: Sparkles, label: "Sugar Level", value: "98", sub: "mg/dL", tone: "primary", trend: "up" },
    { icon: Moon, label: "Sleep Hours", value: "7.2h", sub: "Good rest", tone: "chart-3", trend: "up" },
    { icon: Droplets, label: "Water Intake", value: "1.6L", sub: "of 2.0L", tone: "teal", trend: null },
    { icon: Weight, label: "Weight", value: "68 kg", sub: "Stable", tone: "primary", trend: "down" },
    { icon: HeartPulse, label: "Heart Rate", value: "72 bpm", sub: "Resting", tone: "destructive", trend: null },
    { icon: Activity, label: "Health Progress", value: "92%", sub: "This week", tone: "primary", trend: "up" },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {vitals.map((v) => (
        <div
          key={v.label}
          className="group rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-soft hover:-translate-y-0.5 hover:shadow-elevated transition-all"
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className={`grid h-10 w-10 place-items-center rounded-xl bg-${v.tone}/10 text-${v.tone}`}
              style={{
                backgroundColor: `color-mix(in oklab, var(--color-${v.tone}) 12%, transparent)`,
                color: `var(--color-${v.tone})`,
              }}
            >
              <v.icon className="h-5 w-5" />
            </span>
            {v.trend && (
              <span
                className={`text-xs font-semibold ${
                  v.trend === "up" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {v.trend === "up" ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs font-medium text-muted-foreground">{v.label}</p>
          <p className="text-2xl font-bold mt-0.5 truncate">{v.value}</p>
          <p className="text-xs text-muted-foreground">{v.sub}</p>
        </div>
      ))}
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

function UpcomingMedicine() {
  const meds = [
    { name: "Metformin", dose: "500mg", time: "8:00 AM", color: "primary" },
    { name: "Lisinopril", dose: "10mg", time: "12:00 PM", color: "teal" },
    { name: "Atorvastatin", dose: "20mg", time: "9:00 PM", color: "warning" },
  ];
  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
      <h3 className="text-lg font-semibold mb-4">Upcoming Medicine</h3>
      <div className="space-y-3">
        {meds.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60"
          >
            <span
              className="grid h-10 w-10 place-items-center rounded-xl"
              style={{
                backgroundColor: `color-mix(in oklab, var(--color-${m.color}) 15%, transparent)`,
                color: `var(--color-${m.color})`,
              }}
            >
              <Pill className="h-5 w-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.dose}</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {m.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmergencyStatus() {
  return (
    <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-teal/10 p-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
          <ShieldAlert className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold">All Clear</p>
          <p className="text-xs text-muted-foreground">No active emergencies</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Last SOS check: today, 7:30 AM · Caregiver on duty
      </p>
    </div>
  );
}

function RecentNotifications() {
  const items = [
    { icon: Check, text: "Medicine taken — Metformin", time: "8:02 AM", tone: "primary" },
    { icon: Activity, text: "BP updated — 121/80", time: "9:15 AM", tone: "teal" },
    { icon: Bell, text: "Caregiver added a note", time: "10:30 AM", tone: "chart-3" },
  ];
  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {items.map((i, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg mt-0.5"
              style={{
                backgroundColor: `color-mix(in oklab, var(--color-${i.tone}) 15%, transparent)`,
                color: `var(--color-${i.tone})`,
              }}
            >
              <i.icon className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{i.text}</p>
              <p className="text-xs text-muted-foreground">{i.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
