import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pill, Clock, Check, X, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/medicine")({
  head: () => ({ meta: [{ title: "Medicine — Sunaulo" }] }),
  component: MedicinePage,
});

const initial = [
  { id: 1, name: "Metformin", dose: "500 mg", time: "8:00 AM", category: "Diabetes", status: "pending" },
  { id: 2, name: "Lisinopril", dose: "10 mg", time: "12:00 PM", category: "Blood Pressure", status: "pending" },
  { id: 3, name: "Vitamin D3", dose: "1000 IU", time: "1:00 PM", category: "Supplement", status: "pending" },
  { id: 4, name: "Atorvastatin", dose: "20 mg", time: "9:00 PM", category: "Cholesterol", status: "pending" },
];
const history = [
  { name: "Metformin", time: "Yesterday · 8:00 AM", status: "taken" },
  { name: "Lisinopril", time: "Yesterday · 12:00 PM", status: "taken" },
  { name: "Atorvastatin", time: "Yesterday · 9:00 PM", status: "skipped" },
  { name: "Vitamin D3", time: "2 days ago · 1:00 PM", status: "taken" },
];

function MedicinePage() {
  const [meds, setMeds] = useState(initial);
  const update = (id: number, status: "taken" | "skipped") => {
    setMeds((m) => m.map((x) => (x.id === id ? { ...x, status } : x)));
    toast.success(status === "taken" ? "Marked as taken" : "Marked as skipped");
  };
  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Medicine Schedule</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {meds.filter((m) => m.status === "taken").length} of {meds.length} taken today
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {meds.map((m) => (
          <div
            key={m.id}
            className={`rounded-3xl border p-6 shadow-soft transition-all ${
              m.status === "taken"
                ? "bg-primary/5 border-primary/30"
                : m.status === "skipped"
                ? "bg-muted/40 border-border opacity-70"
                : "bg-card border-border hover:-translate-y-0.5 hover:shadow-elevated"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-teal text-primary-foreground">
                <Pill className="h-6 w-6" />
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                {m.category}
              </span>
            </div>
            <h3 className="text-xl font-bold">{m.name}</h3>
            <p className="text-sm text-muted-foreground">{m.dose}</p>
            <div className="mt-3 flex items-center gap-1.5 text-sm font-medium">
              <Clock className="h-4 w-4 text-muted-foreground" /> {m.time}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button
                onClick={() => update(m.id, "taken")}
                disabled={m.status !== "pending"}
                className="rounded-full gap-1.5"
              >
                <Check className="h-4 w-4" /> Taken
              </Button>
              <Button
                onClick={() => update(m.id, "skipped")}
                disabled={m.status !== "pending"}
                variant="outline"
                className="rounded-full gap-1.5"
              >
                <X className="h-4 w-4" /> Skip
              </Button>
            </div>
            {m.status !== "pending" && (
              <p className="mt-3 text-xs text-center font-semibold text-muted-foreground">
                {m.status === "taken" ? "✓ Logged at " + m.time : "Marked as skipped"}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-muted-foreground" /> Medicine History
        </h2>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/40"
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl ${
                  h.status === "taken"
                    ? "bg-primary/15 text-primary"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {h.status === "taken" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{h.name}</p>
                <p className="text-xs text-muted-foreground">{h.time}</p>
              </div>
              <span
                className={`text-xs font-bold capitalize ${
                  h.status === "taken" ? "text-primary" : "text-destructive"
                }`}
              >
                {h.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
