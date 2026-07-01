import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import {
  Pill,
  Gauge,
  HeartPulse,
  Activity,
  Bell,
  Clock,
  ShieldAlert,
  Users,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  XCircle,
  Timer,
  UserCheck,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/dashboard/")({
  head: () => ({ meta: [{ title: "Dashboard — Sunaulo" }] }),
  component: DashboardHome,
});


function DashboardHome() {
  const { user } = useAuth();
  const role = user?.role ?? "elderly";

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.dashboard,
    retry: 1,
    staleTime: 30_000,
  });

  const { data: medicines } = useQuery({
    queryKey: ["medicines-today"],
    queryFn: api.medicines.today,
    retry: 1,
    staleTime: 30_000,
  });

  const { data: logs } = useQuery({
    queryKey: ["medicine-logs"],
    queryFn: api.medicineLogs.list,
    retry: 1,
    staleTime: 30_000,
  });

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <Greeting />

      {role === "elderly" && (
        <ElderlyDashboard dashboard={dashboard} medicines={medicines?.data} logs={logs?.data} loading={isLoading} />
      )}
      {role === "caregiver" && (
        <CaregiverDashboard dashboard={dashboard} loading={isLoading} />
      )}
      {role === "family" && (
        <FamilyDashboard dashboard={dashboard} medicines={medicines?.data} logs={logs?.data} loading={isLoading} />
      )}
    </div>
  );
}

function Greeting() {
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const roleConfig = {
    elderly:   { emoji: "👵", subtitle: "Here are your medicines and health summary for today." },
    caregiver: { emoji: "👩‍⚕️", subtitle: "Here's an overview of your patients and their care status." },
    family:    { emoji: "👨‍👩‍👧", subtitle: "Here's how your loved one is doing today." },
  };
  const { emoji, subtitle } = roleConfig[user?.role ?? "elderly"];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center animate-card-reveal">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {greeting}, {firstName} {emoji}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> Live
      </div>
    </div>
  );
}

/* ─── ELDERLY DASHBOARD ──────────────────────────────────────────────────── */

function ElderlyDashboard({ dashboard, medicines, logs, loading }: {
  dashboard?: any; medicines?: any[]; logs?: any[]; loading?: boolean;
}) {
  const takenToday = logs?.filter((l: any) => l.taken).length ?? 0;
  const totalToday = medicines?.length ?? 0;
  const pending = totalToday - takenToday;
  const latestRecord = dashboard?.recent_health_records?.[0];

  const vitals = [
    {
      icon: Pill, label: "Medicines Today",
      value: loading ? "—" : `${takenToday}/${totalToday}`,
      sub: loading ? "" : `${pending} pending`, tone: "primary",
    },
    {
      icon: HeartPulse, label: "Blood Pressure",
      value: latestRecord?.blood_pressure ?? "—",
      sub: latestRecord ? "Last reading" : "No reading yet", tone: "teal",
    },
    {
      icon: Activity, label: "Heart Rate",
      value: latestRecord?.heart_rate ? `${latestRecord.heart_rate} bpm` : "—",
      sub: latestRecord ? "Last reading" : "No reading yet", tone: "destructive",
    },
    {
      icon: Gauge, label: "Blood Sugar",
      value: latestRecord?.blood_sugar ? `${latestRecord.blood_sugar} mg/dL` : "—",
      sub: latestRecord ? "Last reading" : "No reading yet", tone: "primary",
    },
  ];

  return (
    <>
      {/* Vitals grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {vitals.map((v, i) => (
          <div
            key={v.label}
            className="group rounded-2xl bg-card border border-border p-4 sm:p-5 shadow-soft hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 animate-card-reveal"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between gap-2">
              <span
                className="grid h-10 w-10 place-items-center rounded-xl"
                style={{
                  backgroundColor: `color-mix(in oklab, var(--color-${v.tone}) 12%, transparent)`,
                  color: `var(--color-${v.tone})`,
                }}
              >
                <v.icon className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-3 text-xs font-medium text-muted-foreground">{v.label}</p>
            <p className="text-2xl font-bold mt-0.5 truncate animate-count-up">{v.value}</p>
            <p className="text-xs text-muted-foreground">{v.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <HealthRecordsChart records={dashboard?.recent_health_records} />
          <MedicineComplianceChart logs={logs} medicines={medicines} />
        </div>
        <div className="space-y-6">
          <UpcomingMedicines medicines={medicines} />
          <SOSStatusCard />
          <RecentNotifications />
        </div>
      </div>
    </>
  );
}

/* ─── CAREGIVER DASHBOARD ────────────────────────────────────────────────── */

function CaregiverDashboard({ dashboard, loading }: { dashboard?: any; loading?: boolean }) {
  const { data: elderly } = useQuery({
    queryKey: ["elderly"],
    queryFn: api.elderly.list,
    retry: 1,
    staleTime: 60_000,
  });

  const stats = [
    { icon: Users,     label: "Patients",        value: loading ? "—" : String(elderly?.data?.length ?? dashboard?.total_elderly ?? "0"), sub: "Under your care",    tone: "primary" },
    { icon: AlertCircle, label: "Active SOS",    value: loading ? "—" : String(dashboard?.active_sos_count ?? "0"),                        sub: "Needs attention",    tone: "destructive" },
    { icon: BarChart3, label: "Today's Compliance", value: loading ? "—" : `${dashboard?.today_compliance ?? 0}%`,                        sub: "Medicine adherence", tone: "success" },
    { icon: HeartPulse,label: "New Records",     value: loading ? "—" : String(dashboard?.recent_health_records?.length ?? 0),           sub: "Today",              tone: "teal" },
  ];

  const patientList = elderly?.data ?? [];

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 animate-card-reveal"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span
              className="grid h-11 w-11 place-items-center rounded-xl mb-3"
              style={{
                backgroundColor: `color-mix(in oklab, var(--color-${s.tone}) 12%, transparent)`,
                color: `var(--color-${s.tone})`,
              }}
            >
              <s.icon className="h-5 w-5" />
            </span>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-3xl font-bold tracking-tight mt-0.5 animate-count-up">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient list */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-card border border-border p-6 shadow-soft animate-card-reveal" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" /> My Patients
              </h3>
              <a href="/dashboard/medicine" className="text-xs text-primary font-semibold hover:underline">
                Manage medicines →
              </a>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 rounded-2xl shimmer" />
                ))}
              </div>
            ) : patientList.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <UserCheck className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm font-medium">No patients yet</p>
                <p className="text-xs mt-1">Register elderly patients from the Medicine page</p>
              </div>
            ) : (
              <div className="space-y-3">
                {patientList.map((p: any, i: number) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors animate-card-reveal"
                    style={{ animationDelay: `${300 + i * 60}ms` }}
                  >
                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-sm shrink-0">
                      {(p.name ?? "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.age ? `${p.age} years` : ""}{p.blood_group ? ` · ${p.blood_group}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-semibold">Active</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <RecentAlerts />
          <RecentNotifications />
        </div>
      </div>
    </>
  );
}

/* ─── FAMILY DASHBOARD ───────────────────────────────────────────────────── */

function FamilyDashboard({ dashboard, medicines, logs, loading }: {
  dashboard?: any; medicines?: any[]; logs?: any[]; loading?: boolean;
}) {
  const takenCount = logs?.filter((l: any) => l.taken).length ?? 0;
  const totalCount = medicines?.length ?? 0;
  const allTaken = totalCount > 0 && takenCount === totalCount;
  const hasSkipped = logs?.some((l: any) => !l.taken) ?? false;
  const compliance = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 0;

  return (
    <>
      {/* Medicine check hero card */}
      <div
        className={`rounded-3xl p-6 animate-card-reveal transition-all ${
          allTaken
            ? "bg-gradient-to-br from-success/10 to-success/5 border border-success/30"
            : hasSkipped
            ? "bg-gradient-to-br from-destructive/10 to-warning/5 border border-warning/30"
            : "bg-gradient-to-br from-primary/10 to-teal/5 border border-primary/30"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Medicine Status Today</p>
            {loading ? (
              <div className="h-8 w-48 rounded shimmer" />
            ) : totalCount === 0 ? (
              <h2 className="text-2xl font-bold">No medicines scheduled</h2>
            ) : allTaken ? (
              <>
                <h2 className="text-2xl font-bold text-success">All medicines taken! ✓</h2>
                <p className="text-sm text-muted-foreground mt-1">{takenCount} of {totalCount} doses completed today</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">
                  {takenCount} of {totalCount} taken
                  {totalCount - takenCount > 0 && (
                    <span className="ml-2 text-base font-medium text-warning">· {totalCount - takenCount} pending</span>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">Compliance today: {compliance}%</p>
              </>
            )}
          </div>
          <div className={`grid h-14 w-14 place-items-center rounded-2xl ${allTaken ? "bg-success/20" : "bg-primary/15"}`}>
            {allTaken ? <CheckCircle2 className="h-7 w-7 text-success" /> : <Pill className="h-7 w-7 text-primary" />}
          </div>
        </div>

        {/* Medicine list */}
        {!loading && (medicines ?? []).length > 0 && (
          <div className="mt-5 space-y-2">
            {(medicines ?? []).slice(0, 4).map((m: any, i: number) => {
              const log = logs?.find((l: any) => l.medicine_id === m.id);
              const status = log ? (log.taken ? "taken" : "skipped") : "pending";
              return (
                <div
                  key={m.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/60 animate-card-reveal"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span className={`grid h-8 w-8 place-items-center rounded-lg shrink-0 ${
                    status === "taken"   ? "bg-success/15 text-success" :
                    status === "skipped" ? "bg-destructive/15 text-destructive" :
                    "bg-warning/15 text-warning"
                  }`}>
                    {status === "taken" ? <CheckCircle2 className="h-4 w-4" /> :
                     status === "skipped" ? <XCircle className="h-4 w-4" /> :
                     <Timer className="h-4 w-4" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{m.name ?? m.medicine_name}</p>
                    <p className="text-xs text-muted-foreground">{m.dosage}</p>
                  </div>
                  <span className={`text-xs font-bold capitalize ${
                    status === "taken" ? "text-success" :
                    status === "skipped" ? "text-destructive" :
                    "text-warning"
                  }`}>
                    {status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: BarChart3,  label: "Compliance",    value: `${compliance}%`,   sub: "Today",          tone: "primary" },
          { icon: HeartPulse, label: "Vitals Status",  value: dashboard?.latest_health?.blood_pressure ?? "—", sub: dashboard?.latest_health ? "Blood pressure" : "No records yet", tone: "success" },
          { icon: ShieldAlert,label: "Active SOS",    value: dashboard?.active_sos ? "ALERT" : "None",  sub: "Emergency",  tone: dashboard?.active_sos ? "destructive" : "teal" },
        ].map((s, i) => (
          <div
            key={s.label}
            className="rounded-2xl bg-card border border-border p-5 shadow-soft hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 animate-card-reveal"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl mb-3"
              style={{
                backgroundColor: `color-mix(in oklab, var(--color-${s.tone}) 12%, transparent)`,
                color: `var(--color-${s.tone})`,
              }}>
              <s.icon className="h-5 w-5" />
            </span>
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="text-2xl font-bold mt-0.5 animate-count-up">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MedicineComplianceChart logs={logs} medicines={medicines} />
        </div>
        <div className="space-y-6">
          <SOSStatusCard />
          <RecentNotifications />
        </div>
      </div>
    </>
  );
}

/* ─── Shared sub-components ─────────────────────────────────────────────── */

function HealthRecordsChart({ records }: { records?: any[] }) {
  const chartData = (records ?? [])
    .slice()
    .reverse()
    .map((r: any) => ({
      d: new Date(r.recorded_at ?? r.created_at).toLocaleDateString("en", { weekday: "short" }),
      sys: r.systolic ?? null,
      dia: r.diastolic ?? null,
    }))
    .filter((r) => r.sys !== null);

  return (
    <ChartCard title="Blood Pressure" subtitle="Recent readings · mmHg">
      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
          <HeartPulse className="h-10 w-10 mb-3 opacity-25" />
          <p className="text-sm font-medium">No health records yet</p>
          <p className="text-xs mt-1">Your caregiver will add readings here</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[60, 160]} />
            <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
            <Line type="monotone" dataKey="sys" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-primary)" }} name="Systolic" />
            <Line type="monotone" dataKey="dia" stroke="var(--color-teal)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-teal)" }} name="Diastolic" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

function MedicineComplianceChart({ logs, medicines }: { logs?: any[]; medicines?: any[] }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const dayLabel = days[d.getDay()];
    const dayStr = d.toISOString().slice(0, 10);
    const dayLogs = (logs ?? []).filter((l: any) => (l.logged_at ?? l.created_at ?? "").slice(0, 10) === dayStr);
    const taken = dayLogs.filter((l: any) => l.taken).length;
    const total = dayLogs.length;
    return { d: dayLabel, v: total > 0 ? Math.round((taken / total) * 100) : null };
  });

  const hasData = chartData.some((d) => d.v !== null);

  return (
    <ChartCard title="Medicine Compliance" subtitle="This week (%)">
      {!hasData ? (
        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
          <BarChart3 className="h-10 w-10 mb-3 opacity-25" />
          <p className="text-sm font-medium">No medicine logs this week</p>
          <p className="text-xs mt-1">Start logging medicines to see trends</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={12} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} />
            <Bar dataKey="v" fill="var(--color-primary)" radius={[12, 12, 0, 0]} name="Compliance %" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft animate-card-reveal">
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

function UpcomingMedicines({ medicines }: { medicines?: any[] }) {
  const list = (medicines ?? []).slice(0, 3);

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft animate-card-reveal" style={{ animationDelay: "200ms" }}>
      <h3 className="text-lg font-semibold mb-4">Upcoming Medicines</h3>
      {list.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Pill className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No medicines scheduled yet</p>
          <p className="text-xs mt-1">Your caregiver will add them for you</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((m: any, i: number) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/60">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Pill className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{m.name ?? m.medicine_name}</p>
                <p className="text-xs text-muted-foreground">{m.dosage}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground shrink-0">
                <Clock className="h-3.5 w-3.5" />
                {(m.reminder_times ?? ["—"])[0]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SOSStatusCard() {
  const { data } = useQuery({
    queryKey: ["sos"],
    queryFn: api.sos.list,
    retry: 1,
    staleTime: 30_000,
  });
  const activeAlerts = data?.data?.filter((a: any) => a.status === "active") ?? [];
  const hasAlert = activeAlerts.length > 0;

  return (
    <div
      className={`rounded-3xl p-6 animate-card-reveal ${
        hasAlert
          ? "bg-destructive/10 border border-destructive/30"
          : "bg-gradient-to-br from-primary/10 to-teal/5 border border-primary/20"
      }`}
      style={{ animationDelay: "300ms" }}
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`relative grid h-10 w-10 place-items-center rounded-xl ${hasAlert ? "bg-destructive text-white" : "bg-primary text-primary-foreground"}`}>
          <ShieldAlert className="h-5 w-5" />
          {hasAlert && (
            <span className="absolute inset-0 rounded-xl border-2 border-destructive animate-pulse-ring" />
          )}
        </span>
        <div>
          <p className="font-semibold">{hasAlert ? `${activeAlerts.length} Active Alert!` : "All Clear"}</p>
          <p className="text-xs text-muted-foreground">
            {hasAlert ? "Emergency assistance needed" : "No active emergencies"}
          </p>
        </div>
      </div>
    </div>
  );
}

function RecentAlerts() {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: api.notifications.list,
    retry: 1,
    staleTime: 30_000,
  });
  const alerts = data?.data?.slice(0, 4) ?? [];

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft animate-card-reveal" style={{ animationDelay: "250ms" }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Bell className="h-5 w-5 text-muted-foreground" /> Recent Alerts
      </h3>
      {alerts.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No alerts yet</p>
          <p className="text-xs mt-1">Activity will appear here as it happens</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((n: any, i: number) => (
            <div key={i} className="flex items-start gap-3 animate-card-reveal" style={{ animationDelay: `${300 + i * 60}ms` }}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg mt-0.5 bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentNotifications() {
  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: api.notifications.list,
    retry: 1,
    staleTime: 30_000,
  });

  const items = data?.data?.slice(0, 3) ?? [];

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft animate-card-reveal" style={{ animationDelay: "350ms" }}>
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      {items.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No activity yet</p>
          <p className="text-xs mt-1">Notifications will show up here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n: any, i: number) => (
            <div key={i} className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg mt-0.5 bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{n.message}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
