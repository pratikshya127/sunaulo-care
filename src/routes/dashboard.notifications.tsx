import { createFileRoute } from "@tanstack/react-router";
import { Pill, Activity, FileText, ShieldAlert, AlertTriangle, Bell } from "lucide-react";

export const Route = createFileRoute("/dashboard/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Sunaulo" }] }),
  component: NotificationsPage,
});

const items = [
  { icon: Pill, tone: "primary", title: "Medicine Taken", body: "Metformin 500mg logged.", time: "Today · 8:02 AM" },
  { icon: Activity, tone: "teal", title: "Blood Pressure Updated", body: "121/80 mmHg — within range.", time: "Today · 9:15 AM" },
  { icon: FileText, tone: "chart-3", title: "Caregiver Updated Health Record", body: "Sarah added a note about morning routine.", time: "Today · 10:30 AM" },
  { icon: ShieldAlert, tone: "destructive", title: "SOS Activated", body: "Emergency was triggered and resolved in 4 min.", time: "Yesterday · 6:45 PM" },
  { icon: AlertTriangle, tone: "warning", title: "Missed Medicine", body: "Atorvastatin was skipped at 9:00 PM.", time: "Yesterday · 9:30 PM" },
  { icon: Bell, tone: "primary", title: "Weekly Report Ready", body: "Your weekly health summary is available.", time: "2 days ago" },
];

function NotificationsPage() {
  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground mt-1">Everything that's happened, in order.</p>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-border" />
        <div className="space-y-4">
          {items.map((i, idx) => (
            <div key={idx} className="relative flex gap-4 pl-0">
              <span
                className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-4 border-background"
                style={{
                  backgroundColor: `color-mix(in oklab, var(--color-${i.tone}) 15%, transparent)`,
                  color: `var(--color-${i.tone})`,
                }}
              >
                <i.icon className="h-4 w-4" />
              </span>
              <div className="flex-1 rounded-2xl bg-card border border-border p-4 shadow-soft hover:shadow-elevated transition">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold">{i.title}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{i.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{i.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
