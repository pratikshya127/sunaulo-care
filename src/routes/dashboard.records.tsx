import { createFileRoute } from "@tanstack/react-router";
import { HeartPulse, FileText, Calendar, User } from "lucide-react";

export const Route = createFileRoute("/dashboard/records")({
  head: () => ({ meta: [{ title: "Health Records — Sunaulo" }] }),
  component: RecordsPage,
});

const records = [
  { date: "Jun 24, 2026", title: "Quarterly Checkup", doctor: "Dr. Meera Joshi", note: "BP, sugar, and weight all within healthy range. Continue current medication." },
  { date: "May 12, 2026", title: "Cardiology Visit", doctor: "Dr. Anil Khadka", note: "ECG normal. Recommended 30 min walking daily." },
  { date: "Apr 03, 2026", title: "Blood Work", doctor: "Lab Report", note: "HbA1c: 6.2 · Cholesterol: 180 · Vitamin D: low (supplement added)." },
  { date: "Feb 18, 2026", title: "Eye Examination", doctor: "Dr. Reena Lama", note: "Prescription updated. No signs of cataract." },
];

function RecordsPage() {
  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <User className="h-7 w-7" />
        </span>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asha Rai</h1>
          <p className="text-sm text-muted-foreground">72 years · Female · Blood type O+</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "Conditions", value: "Hypertension, Type 2 Diabetes" },
          { label: "Allergies", value: "Penicillin" },
          { label: "Primary Doctor", value: "Dr. Meera Joshi" },
        ].map((x) => (
          <div key={x.label} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
            <p className="text-xs text-muted-foreground font-medium">{x.label}</p>
            <p className="font-semibold mt-1">{x.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <HeartPulse className="h-5 w-5 text-primary" /> Recent Records
        </h2>
        <div className="space-y-3">
          {records.map((r, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-2xl bg-secondary/40 hover:bg-secondary transition"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{r.title}</p>
                  <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
                    <Calendar className="h-3 w-3" /> {r.date}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{r.doctor}</p>
                <p className="text-sm mt-2">{r.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
