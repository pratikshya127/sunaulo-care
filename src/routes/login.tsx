import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Eye, EyeOff, Stethoscope, Users, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && localStorage.getItem("sunaulo.token")) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Sign In — Sunaulo" }] }),
  component: LoginPage,
});

const ROLES: { key: Role; label: string; icon: React.ElementType; desc: string; color: string }[] = [
  { key: "elderly",   label: "Elderly",    icon: Heart,        desc: "View my care plan",     color: "primary" },
  { key: "caregiver", label: "Caregiver",  icon: Stethoscope,  desc: "Manage my patients",   color: "success" },
  { key: "family",    label: "Family",     icon: Users,        desc: "Monitor loved ones",    color: "chart-3" },
];

const ROLE_TIPS: Record<Role, string> = {
  elderly:   "See your medicines, vitals, and daily health summary.",
  caregiver: "Access all your patients' records and compliance reports.",
  family:    "Monitor your loved one's health and medicine status.",
};

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("elderly");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message ?? "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  const selected = ROLES.find((r) => r.key === role)!;

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Animated background blobs */}
      <div
        className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full opacity-30 animate-blob"
        style={{ background: "radial-gradient(circle, #C89B3C 0%, #F3E6B3 60%, transparent 80%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-24 h-80 w-80 rounded-full opacity-20 animate-blob"
        style={{
          background: "radial-gradient(circle, #B7892F 0%, #F3E6B3 60%, transparent 80%)",
          animationDelay: "3s",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 right-1/4 h-56 w-56 rounded-full opacity-15 animate-blob"
        style={{
          background: "radial-gradient(circle, #5B8F6A 0%, transparent 70%)",
          animationDelay: "6s",
        }}
      />

      <div className="w-full max-w-md relative animate-card-reveal">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2 group">
            <span className="relative grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow group-hover:scale-105 transition-transform duration-300">
              <Heart className="h-8 w-8" />
              <span className="absolute inset-0 rounded-2xl animate-pulse-ring" style={{ border: "2px solid #C89B3C" }} />
            </span>
            <span className="text-2xl font-bold tracking-tight">Sunaulo</span>
            <span className="text-sm text-muted-foreground">Caring Beyond Medicine</span>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-elevated">
          <h1 className="text-2xl font-bold tracking-tight text-center mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Sign in to continue your care journey
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {ROLES.map((r, i) => {
              const Icon = r.icon;
              const active = role === r.key;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 text-xs font-semibold transition-all duration-300 animate-card-reveal ${
                    active
                      ? "border-primary bg-primary/10 text-primary scale-[1.03] shadow-soft"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/60"
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Icon className={`h-5 w-5 transition-transform duration-300 ${active ? "scale-110" : ""}`} />
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Role tip */}
          <div className="mb-5 px-4 py-2.5 rounded-xl bg-secondary/60 text-xs text-muted-foreground flex items-center gap-2 animate-slide-right">
            <UserCheck className="h-3.5 w-3.5 shrink-0 text-primary" />
            {ROLE_TIPS[role]}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="rounded-xl transition-shadow focus:shadow-glow"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="rounded-xl pr-10 transition-shadow focus:shadow-glow"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  aria-label="Toggle password visibility"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3 animate-card-reveal flex items-start gap-2">
                <span className="shrink-0 mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-full h-11 text-base shadow-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                  Signing in…
                </span>
              ) : (
                `Sign in as ${selected.label}`
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
