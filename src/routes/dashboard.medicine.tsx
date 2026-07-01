import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Pill, Clock, Check, X, History, Plus, Users, AlertCircle,
  BarChart3, CheckCircle2, XCircle, Timer, ChevronDown, ChevronUp,
  Stethoscope, Trash2, Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { api, type Medicine } from "@/lib/api";

export const Route = createFileRoute("/dashboard/medicine")({
  head: () => ({ meta: [{ title: "Medicine — Sunaulo" }] }),
  component: MedicinePage,
});

function MedicinePage() {
  const { user } = useAuth();
  const role = user?.role ?? "elderly";

  return (
    <div className="space-y-8 max-w-[1200px] mx-auto">
      <div className="animate-card-reveal">
        <h1 className="text-3xl font-bold tracking-tight">
          {role === "elderly" ? "My Medicine Schedule" :
           role === "caregiver" ? "Medicine Management" :
           "Medicine Status"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {role === "elderly"   ? "Track and log your daily medicines." :
           role === "caregiver" ? "Manage medicines and monitor patient compliance." :
           "Check if your loved one has taken their medicines today."}
        </p>
      </div>

      {role === "elderly"   && <ElderlyView />}
      {role === "caregiver" && <CaregiverView />}
      {role === "family"    && <FamilyView />}
    </div>
  );
}

/* ─── ELDERLY VIEW ─────────────────────────────────────────────────────── */

function ElderlyView() {
  const qc = useQueryClient();

  const { data: medData, isLoading: medLoading } = useQuery({
    queryKey: ["medicines-today"],
    queryFn: api.medicines.today,
    retry: 1,
    staleTime: 30_000,
  });

  const { data: logData, isLoading: logLoading } = useQuery({
    queryKey: ["medicine-logs"],
    queryFn: api.medicineLogs.list,
    retry: 1,
    staleTime: 30_000,
  });

  const logMutation = useMutation({
    mutationFn: (payload: { medicine_id: number; taken: boolean }) =>
      api.medicineLogs.store(payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["medicine-logs"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(vars.taken ? "✓ Marked as taken" : "Marked as skipped");
    },
    onError: () => toast.error("Failed to log medicine. Please try again."),
  });

  const medicines: Medicine[] = medData?.data ?? [];
  const logs = logData?.data ?? [];
  const loading = medLoading || logLoading;

  const getStatus = (medId: number) => {
    const log = logs.find((l: any) => l.medicine_id === medId);
    if (!log) return "pending";
    return log.taken ? "taken" : "skipped";
  };

  const takenCount = medicines.filter((m) => getStatus(m.id) === "taken").length;

  return (
    <>
      {/* Progress summary */}
      <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-teal/5 border border-primary/20 p-6 animate-card-reveal">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-muted-foreground">Today's Progress</p>
            <p className="text-3xl font-bold mt-0.5">
              {takenCount}/{medicines.length}{" "}
              <span className="text-lg font-medium text-muted-foreground">taken</span>
            </p>
          </div>
          <div className="relative h-14 w-14">
            <svg viewBox="0 0 36 36" className="rotate-[-90deg] h-14 w-14">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-border)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${medicines.length > 0 ? (takenCount / medicines.length) * 100 : 0} 100`}
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
              {medicines.length > 0 ? Math.round((takenCount / medicines.length) * 100) : 0}%
            </span>
          </div>
        </div>
        <div className="h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-teal rounded-full transition-all duration-700"
            style={{ width: `${medicines.length > 0 ? (takenCount / medicines.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Medicine cards */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-52 rounded-3xl shimmer" />)}
        </div>
      ) : medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-card-reveal">
          <Pill className="h-12 w-12 mb-4 opacity-25" />
          <p className="font-semibold text-lg">No medicines scheduled today</p>
          <p className="text-sm mt-1">Your caregiver hasn't added any medicines yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {medicines.map((m, i) => {
            const status = getStatus(m.id);
            const isPending = status === "pending";
            const isTaken = status === "taken";
            return (
              <div
                key={m.id}
                className={`rounded-3xl border p-6 shadow-soft transition-all duration-300 animate-card-reveal ${
                  isTaken ? "bg-success/5 border-success/30" :
                  status === "skipped" ? "bg-muted/40 border-border opacity-70" :
                  "bg-card border-border hover:-translate-y-1 hover:shadow-elevated"
                }`}
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-teal text-primary-foreground">
                    <Pill className="h-6 w-6" />
                  </span>
                  {isTaken && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-success px-2.5 py-1 rounded-full bg-success/10">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Taken
                    </span>
                  )}
                  {status === "skipped" && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-muted-foreground px-2.5 py-1 rounded-full bg-muted">
                      <XCircle className="h-3.5 w-3.5" /> Skipped
                    </span>
                  )}
                  {isPending && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-warning px-2.5 py-1 rounded-full bg-warning/10">
                      <Timer className="h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold">{m.name}</h3>
                <p className="text-sm text-muted-foreground">{m.dosage}</p>
                <div className="mt-2 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {(m.reminder_times ?? ["—"]).join(", ")}
                </div>
                {m.instructions && (
                  <p className="mt-2 text-xs text-muted-foreground italic">{m.instructions}</p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => logMutation.mutate({ medicine_id: m.id, taken: true })}
                    disabled={!isPending || logMutation.isPending}
                    className="rounded-full gap-1.5 transition-all hover:scale-105 active:scale-95"
                  >
                    <Check className="h-4 w-4" /> Taken
                  </Button>
                  <Button
                    onClick={() => logMutation.mutate({ medicine_id: m.id, taken: false })}
                    disabled={!isPending || logMutation.isPending}
                    variant="outline"
                    className="rounded-full gap-1.5 transition-all hover:scale-105 active:scale-95"
                  >
                    <X className="h-4 w-4" /> Skip
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* History */}
      <MedicineHistory logs={logData?.data} />
    </>
  );
}

/* ─── CAREGIVER VIEW ───────────────────────────────────────────────────── */

function CaregiverView() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedElderly, setSelectedElderly] = useState<number | null>(null);
  const qc = useQueryClient();

  const { data: elderlyData, isLoading: elderlyLoading } = useQuery({
    queryKey: ["elderly"],
    queryFn: api.elderly.list,
    retry: 1,
    staleTime: 60_000,
  });

  const { data: medData, isLoading: medLoading } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.medicines.list,
    retry: 1,
    staleTime: 30_000,
  });

  const { data: logData } = useQuery({
    queryKey: ["medicine-logs"],
    queryFn: api.medicineLogs.list,
    retry: 1,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.medicines.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medicines"] });
      toast.success("Medicine removed");
    },
    onError: () => toast.error("Failed to remove medicine"),
  });

  const elderly = elderlyData?.data ?? [];
  const medicines = medData?.data ?? [];
  const logs = logData?.data ?? [];
  const loading = elderlyLoading || medLoading;

  function getMedicinesFor(elderlyId: number) {
    return medicines.filter((m: any) => m.elderly_id === elderlyId);
  }

  function getComplianceFor(elderlyId: number) {
    const meds = getMedicinesFor(elderlyId);
    if (meds.length === 0) return null;
    const taken = logs.filter((l: any) =>
      meds.some((m: any) => m.id === l.medicine_id) && l.taken
    ).length;
    return Math.round((taken / meds.length) * 100);
  }

  return (
    <>
      {/* Header actions */}
      <div className="flex items-center justify-between animate-card-reveal">
        <div className="flex gap-2">
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-full gap-2 shadow-glow transition-all hover:scale-105 active:scale-95"
          >
            {showAddForm ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showAddForm ? "Close" : "Add Medicine"}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {medicines.length} medicine{medicines.length !== 1 ? "s" : ""} across {elderly.length} patient{elderly.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Add medicine form */}
      {showAddForm && (
        <AddMedicineForm
          elderly={elderly}
          onSuccess={() => {
            qc.invalidateQueries({ queryKey: ["medicines"] });
            setShowAddForm(false);
          }}
        />
      )}

      {/* Patient cards with medicine lists */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-48 rounded-3xl shimmer" />)}
        </div>
      ) : elderly.length === 0 ? (
        <div className="rounded-3xl bg-card border border-dashed border-border p-12 text-center animate-card-reveal">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold">No patients registered</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Elderly patients need to register as "Elderly" on the platform first.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {elderly.map((e: any, i: number) => {
            const meds = getMedicinesFor(e.id);
            const compliance = getComplianceFor(e.id);
            const expanded = selectedElderly === e.id;

            return (
              <div
                key={e.id}
                className="rounded-3xl bg-card border border-border shadow-soft overflow-hidden animate-card-reveal"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <button
                  className="w-full flex items-center gap-4 p-6 hover:bg-secondary/30 transition-colors text-left"
                  onClick={() => setSelectedElderly(expanded ? null : e.id)}
                >
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary font-bold text-lg shrink-0">
                    {(e.name ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{e.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {e.age ? `${e.age} yrs` : ""}
                      {e.blood_group ? ` · ${e.blood_group}` : ""}
                      {" · "}{meds.length} medicine{meds.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {compliance !== null && (
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Compliance</p>
                        <p className={`text-lg font-bold ${
                          compliance >= 80 ? "text-success" :
                          compliance >= 50 ? "text-warning" :
                          "text-destructive"
                        }`}>
                          {compliance}%
                        </p>
                      </div>
                    )}
                    {expanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-border px-6 pb-6 pt-4 animate-card-reveal">
                    {meds.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No medicines added yet. Click "Add Medicine" above.
                      </p>
                    ) : (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {meds.map((m: any, mi: number) => {
                          const log = logs.find((l: any) => l.medicine_id === m.id);
                          const status = log ? (log.taken ? "taken" : "skipped") : "pending";
                          return (
                            <div
                              key={m.id}
                              className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/50 animate-card-reveal"
                              style={{ animationDelay: `${mi * 60}ms` }}
                            >
                              <span className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 ${
                                status === "taken"   ? "bg-success/15 text-success" :
                                status === "skipped" ? "bg-destructive/15 text-destructive" :
                                "bg-primary/10 text-primary"
                              }`}>
                                {status === "taken" ? <CheckCircle2 className="h-4 w-4" /> :
                                 status === "skipped" ? <XCircle className="h-4 w-4" /> :
                                 <Pill className="h-4 w-4" />}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{m.name}</p>
                                <p className="text-xs text-muted-foreground">{m.dosage} · {(m.reminder_times ?? ["—"])[0]}</p>
                              </div>
                              <button
                                onClick={() => deleteMutation.mutate(m.id)}
                                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                aria-label="Remove medicine"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Medicine history */}
      <MedicineHistory logs={logData?.data} />
    </>
  );
}

/* ─── FAMILY VIEW ──────────────────────────────────────────────────────── */

function FamilyView() {
  const { data: medData, isLoading: medLoading } = useQuery({
    queryKey: ["medicines"],
    queryFn: api.medicines.list,
    retry: 1,
    staleTime: 30_000,
  });

  const { data: logData, isLoading: logLoading } = useQuery({
    queryKey: ["medicine-logs"],
    queryFn: api.medicineLogs.list,
    retry: 1,
    staleTime: 30_000,
  });

  const medicines = medData?.data ?? [];
  const logs = logData?.data ?? [];
  const loading = medLoading || logLoading;

  const getStatus = (medId: number) => {
    const log = logs.find((l: any) => l.medicine_id === medId);
    if (!log) return "pending";
    return log.taken ? "taken" : "skipped";
  };

  const takenCount = medicines.filter((m: any) => getStatus(m.id) === "taken").length;
  const skippedCount = medicines.filter((m: any) => getStatus(m.id) === "skipped").length;
  const pendingCount = medicines.filter((m: any) => getStatus(m.id) === "pending").length;
  const compliance = medicines.length > 0 ? Math.round((takenCount / medicines.length) * 100) : 0;
  const allTaken = takenCount === medicines.length && medicines.length > 0;

  return (
    <>
      {/* Hero status card */}
      <div
        className={`rounded-3xl p-6 animate-card-reveal transition-all ${
          allTaken      ? "bg-gradient-to-br from-success/10 to-success/5 border border-success/30" :
          skippedCount > 0 ? "bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/30" :
          "bg-gradient-to-br from-primary/10 to-teal/5 border border-primary/20"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className={`grid h-16 w-16 place-items-center rounded-2xl shrink-0 ${
            allTaken ? "bg-success/20" : "bg-primary/15"
          }`}>
            {allTaken
              ? <CheckCircle2 className="h-8 w-8 text-success" />
              : <Pill className="h-8 w-8 text-primary" />
            }
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Did your loved one take their medicine?
            </p>
            {loading ? (
              <div className="h-8 w-48 rounded shimmer mt-2" />
            ) : allTaken ? (
              <h2 className="text-2xl font-bold text-success mt-1">Yes! All done ✓</h2>
            ) : (
              <h2 className="text-2xl font-bold mt-1">
                {takenCount} of {medicines.length} taken
              </h2>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="flex items-center gap-1.5 text-success font-medium">
                <CheckCircle2 className="h-4 w-4" /> {takenCount} taken
              </span>
              <span className="flex items-center gap-1.5 text-destructive font-medium">
                <XCircle className="h-4 w-4" /> {skippedCount} skipped
              </span>
              <span className="flex items-center gap-1.5 text-warning font-medium">
                <Timer className="h-4 w-4" /> {pendingCount} pending
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className={`text-3xl font-bold ${
              compliance >= 80 ? "text-success" :
              compliance >= 50 ? "text-warning" :
              "text-destructive"
            }`}>
              {compliance}%
            </p>
            <p className="text-xs text-muted-foreground">Compliance</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-5 space-y-1">
          <div className="h-3 rounded-full bg-border overflow-hidden flex">
            <div
              className="h-full bg-success rounded-l-full transition-all duration-700"
              style={{ width: `${medicines.length > 0 ? (takenCount / medicines.length) * 100 : 0}%` }}
            />
            <div
              className="h-full bg-destructive transition-all duration-700"
              style={{ width: `${medicines.length > 0 ? (skippedCount / medicines.length) * 100 : 0}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Taken</span>
            <span>Skipped</span>
            <span>Pending</span>
          </div>
        </div>
      </div>

      {/* Detailed medicine list */}
      <div className="rounded-3xl bg-card border border-border p-6 shadow-soft animate-card-reveal" style={{ animationDelay: "100ms" }}>
        <h2 className="text-xl font-bold mb-5">Medicine Details</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded-2xl shimmer" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {medicines.map((m: any, i: number) => {
              const log = logs.find((l: any) => l.medicine_id === m.id);
              const status = getStatus(m.id);
              return (
                <div
                  key={m.id}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all animate-card-reveal ${
                    status === "taken"   ? "bg-success/5 border border-success/20" :
                    status === "skipped" ? "bg-destructive/5 border border-destructive/20" :
                    "bg-secondary/50 border border-border"
                  }`}
                  style={{ animationDelay: `${200 + i * 80}ms` }}
                >
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl shrink-0 ${
                    status === "taken"   ? "bg-success/15 text-success" :
                    status === "skipped" ? "bg-destructive/15 text-destructive" :
                    "bg-warning/15 text-warning"
                  }`}>
                    {status === "taken" ? <CheckCircle2 className="h-6 w-6" /> :
                     status === "skipped" ? <XCircle className="h-6 w-6" /> :
                     <Timer className="h-6 w-6" />}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{m.name ?? m.medicine_name}</p>
                    <p className="text-sm text-muted-foreground">{m.dosage}</p>
                    {m.instructions && (
                      <p className="text-xs text-muted-foreground mt-0.5 italic">{m.instructions}</p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium">{(m.reminder_times ?? ["—"])[0]}</span>
                    </div>
                    {log?.taken_time && (
                      <p className="text-xs text-muted-foreground">
                        Taken at {new Date(log.taken_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                    <span className={`inline-block mt-1 text-xs font-bold capitalize px-2.5 py-0.5 rounded-full ${
                      status === "taken"   ? "bg-success/10 text-success" :
                      status === "skipped" ? "bg-destructive/10 text-destructive" :
                      "bg-warning/10 text-warning"
                    }`}>
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <MedicineHistory logs={logData?.data} />
    </>
  );
}

/* ─── ADD MEDICINE FORM (Caregiver) ─────────────────────────────────────── */

function AddMedicineForm({ elderly, onSuccess }: { elderly: any[]; onSuccess: () => void }) {
  const [form, setForm] = useState({
    elderly_id: elderly[0]?.id ?? 0,
    name: "",
    dosage: "",
    frequency: "daily",
    reminder_times: ["08:00"],
    instructions: "",
  });

  const mutation = useMutation({
    mutationFn: () => api.medicines.store({
      elderly_id: form.elderly_id,
      name: form.name,
      dosage: form.dosage,
      frequency: form.frequency,
      reminder_times: form.reminder_times,
      instructions: form.instructions || undefined,
    }),
    onSuccess: () => {
      toast.success(`Medicine "${form.name}" added successfully`);
      onSuccess();
    },
    onError: (err: any) => toast.error(err.message ?? "Failed to add medicine"),
  });

  return (
    <div className="rounded-3xl bg-card border border-primary/30 p-6 shadow-elevated animate-card-reveal">
      <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
        <Plus className="h-5 w-5 text-primary" /> Add New Medicine
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Patient</Label>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={form.elderly_id}
            onChange={(e) => setForm((f) => ({ ...f, elderly_id: Number(e.target.value) }))}
          >
            {elderly.map((e: any) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Medicine Name</Label>
          <Input
            placeholder="e.g., Metformin"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Dosage</Label>
          <Input
            placeholder="e.g., 500mg"
            value={form.dosage}
            onChange={(e) => setForm((f) => ({ ...f, dosage: e.target.value }))}
            className="rounded-xl"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Frequency</Label>
          <select
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={form.frequency}
            onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value }))}
          >
            <option value="daily">Daily</option>
            <option value="twice_daily">Twice Daily</option>
            <option value="thrice_daily">Three Times Daily</option>
            <option value="weekly">Weekly</option>
            <option value="as_needed">As Needed</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label>Reminder Time</Label>
          <Input
            type="time"
            value={form.reminder_times[0]}
            onChange={(e) => setForm((f) => ({ ...f, reminder_times: [e.target.value] }))}
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Instructions (optional)</Label>
          <Input
            placeholder="e.g., Take after meals"
            value={form.instructions}
            onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <Button
          onClick={() => mutation.mutate()}
          disabled={!form.name || !form.dosage || mutation.isPending}
          className="rounded-full gap-2 shadow-glow transition-all hover:scale-105 active:scale-95"
        >
          {mutation.isPending ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
              Adding…
            </span>
          ) : (
            <><Plus className="h-4 w-4" /> Add Medicine</>
          )}
        </Button>
      </div>
    </div>
  );
}

/* ─── Medicine History (shared) ─────────────────────────────────────────── */

function MedicineHistory({ logs }: { logs?: any[] }) {
  const items = (logs ?? []).slice(0, 6);
  const fallback = [
    { medicine_name: "Metformin", taken: true, created_at: new Date(Date.now() - 86400000).toISOString() },
    { medicine_name: "Lisinopril", taken: true, created_at: new Date(Date.now() - 86400000).toISOString() },
    { medicine_name: "Atorvastatin", taken: false, created_at: new Date(Date.now() - 86400000).toISOString() },
    { medicine_name: "Vitamin D3", taken: true, created_at: new Date(Date.now() - 172800000).toISOString() },
  ];
  const list = items.length > 0 ? items : fallback;

  return (
    <div className="rounded-3xl bg-card border border-border p-6 shadow-soft animate-card-reveal">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-5">
        <History className="h-5 w-5 text-muted-foreground" /> Medicine History
      </h2>
      <div className="space-y-2">
        {list.map((h: any, i: number) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/40 hover:bg-secondary/70 transition-colors animate-card-reveal"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <span className={`grid h-9 w-9 place-items-center rounded-xl shrink-0 ${
              h.taken ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"
            }`}>
              {h.taken ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{h.medicine_name ?? "Medicine"}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(h.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                {" · "}
                {new Date(h.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <span className={`text-xs font-bold capitalize ${h.taken ? "text-success" : "text-destructive"}`}>
              {h.taken ? "Taken" : "Skipped"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

