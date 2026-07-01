import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Heart, Search, ChevronRight, UserCircle2, Stethoscope, Users,
  CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, apiFetch } from "@/lib/auth";

export const Route = createFileRoute("/onboarding")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !localStorage.getItem("sunaulo.token")) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({ meta: [{ title: "Set Up Your Profile — Sunaulo" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user } = useAuth();
  const role = user?.role ?? "elderly";

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full opacity-20 animate-blob"
        style={{ background: "radial-gradient(circle, #C89B3C 0%, transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-16 h-64 w-64 rounded-full opacity-15 animate-blob"
        style={{ background: "radial-gradient(circle, #5B8F6A 0%, transparent 70%)", animationDelay: "5s" }}
      />

      <div className="w-full max-w-lg relative animate-card-reveal">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="relative inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow mb-3">
            <Heart className="h-7 w-7" />
            <span className="absolute inset-0 rounded-2xl border-2 border-primary animate-pulse-ring" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Almost there, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-sm text-muted-foreground mt-1">Let's finish setting up your profile</p>
        </div>

        {role === "elderly"   && <ElderlyOnboarding />}
        {role === "caregiver" && <ConnectionOnboarding role="caregiver" />}
        {role === "family"    && <ConnectionOnboarding role="family" />}
      </div>
    </div>
  );
}

/* ─── ELDERLY PROFILE FORM ─────────────────────────────────────────────────── */

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const COMMON_CONDITIONS = [
  "Diabetes", "Hypertension", "Heart Disease", "Arthritis",
  "Asthma", "Osteoporosis", "Dementia", "Depression",
];

function ElderlyOnboarding() {
  const navigate = useNavigate();
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleCondition(c: string) {
    setConditions((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }

  function addCustomCondition() {
    const trimmed = customCondition.trim();
    if (trimmed && !conditions.includes(trimmed)) {
      setConditions((prev) => [...prev, trimmed]);
    }
    setCustomCondition("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/my-profile", {
        method: "POST",
        body: JSON.stringify({
          age: age ? Number(age) : null,
          gender: gender || null,
          blood_group: bloodGroup || null,
          medical_conditions: conditions.length > 0 ? conditions : null,
        }),
      });
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message ?? "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass-card rounded-3xl p-8 shadow-elevated">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <UserCircle2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-bold text-lg">Your Health Profile</h2>
          <p className="text-xs text-muted-foreground">Help your caregivers know you better</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="1" max="120"
              placeholder="e.g. 72"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <div className="flex gap-2">
              {["male", "female", "other"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium capitalize transition-all ${
                    gender === g
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Blood Group</Label>
          <div className="flex flex-wrap gap-2">
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                type="button"
                onClick={() => setBloodGroup(bg === bloodGroup ? "" : bg)}
                className={`px-3 py-1.5 rounded-xl border text-sm font-semibold transition-all ${
                  bloodGroup === bg
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Medical Conditions <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <div className="flex flex-wrap gap-2">
            {COMMON_CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => toggleCondition(c)}
                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                  conditions.includes(c)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30"
                }`}
              >
                {conditions.includes(c) ? "✓ " : ""}{c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="Add other condition..."
              value={customCondition}
              onChange={(e) => setCustomCondition(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomCondition())}
              className="rounded-xl"
            />
            <Button type="button" variant="outline" onClick={addCustomCondition} className="rounded-xl shrink-0">
              Add
            </Button>
          </div>
          {conditions.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {conditions.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                >
                  {c}
                  <button type="button" onClick={() => toggleCondition(c)} className="hover:text-destructive ml-0.5">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-full"
            onClick={() => navigate({ to: "/dashboard" })}
            disabled={loading}
          >
            Skip for now
          </Button>
          <Button type="submit" className="flex-1 rounded-full shadow-glow" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Save &amp; Continue <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/* ─── CAREGIVER / FAMILY CONNECTION FLOW ───────────────────────────────────── */

interface SearchResult {
  id: number;
  name: string;
  email: string;
}

function ConnectionOnboarding({ role }: { role: "caregiver" | "family" }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");

  const label = role === "caregiver" ? "patient" : "loved one";
  const Icon = role === "caregiver" ? Stethoscope : Users;

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setError("");
    setSearched(false);
    setSearching(true);
    setResults([]);
    setSelected(null);
    try {
      const json = await apiFetch(`/users/search?q=${encodeURIComponent(query.trim())}`);
      setResults(json.data ?? []);
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSearching(false);
      setSearched(true);
    }
  }

  async function handleConnect(person: SearchResult) {
    setError("");
    setConnecting(true);
    setSelected(person);
    try {
      await apiFetch("/connect-elderly", {
        method: "POST",
        body: JSON.stringify({ elderly_user_id: person.id }),
      });
      setConnected(true);
    } catch (err: any) {
      setError(err.message ?? "Could not connect. Please try again.");
      setSelected(null);
    } finally {
      setConnecting(false);
    }
  }

  if (connected && selected) {
    return (
      <div className="glass-card rounded-3xl p-8 shadow-elevated text-center animate-card-reveal">
        <span className="inline-grid h-16 w-16 place-items-center rounded-2xl bg-success/15 text-success mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h2 className="text-xl font-bold mb-1">Connected!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          You're now connected to <strong>{selected.name}</strong> as their {role === "caregiver" ? "caregiver" : "family member"}.
        </p>
        <Button className="w-full rounded-full shadow-glow" onClick={() => navigate({ to: "/dashboard" })}>
          Go to Dashboard <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-8 shadow-elevated">
      <div className="flex items-center gap-3 mb-6">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-bold text-lg">
            {role === "caregiver" ? "Who is your patient?" : "Who is your loved one?"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Search by name or email address
          </p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search for your ${label}…`}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearched(false); }}
            className="rounded-xl pl-9"
            autoFocus
          />
        </div>
        <Button type="submit" className="rounded-xl shrink-0 shadow-glow" disabled={searching || !query.trim()}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {/* Results */}
      {searching && (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Searching…</span>
        </div>
      )}

      {searched && !searching && results.length === 0 && (
        <div className="text-center py-10 animate-card-reveal">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold text-foreground">
            We couldn't find anyone named "{query}"
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Make sure they've already signed up as an elderly member, then try searching by their exact name or email.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2 animate-card-reveal">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            {results.length} result{results.length !== 1 ? "s" : ""} found
          </p>
          {results.map((person, i) => (
            <div
              key={person.id}
              className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-secondary/40 transition-all animate-card-reveal"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary font-bold text-sm">
                {person.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{person.name}</p>
                <p className="text-xs text-muted-foreground truncate">{person.email}</p>
              </div>
              <Button
                size="sm"
                className="rounded-full shadow-glow shrink-0"
                onClick={() => handleConnect(person)}
                disabled={connecting && selected?.id === person.id}
              >
                {connecting && selected?.id === person.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3 mt-4 animate-card-reveal">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <button
          type="button"
          onClick={() => navigate({ to: "/dashboard" })}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Skip for now — I'll connect later
        </button>
      </div>
    </div>
  );
}
