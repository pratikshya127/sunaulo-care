import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Eye, EyeOff, Stethoscope, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && localStorage.getItem("sunaulo.token")) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({ meta: [{ title: "Create Account — Sunaulo" }] }),
  component: RegisterPage,
});

const ROLES: {
  key: Role;
  label: string;
  emoji: string;
  icon: React.ElementType;
  desc: string;
  perks: string[];
}[] = [
  {
    key: "elderly",
    label: "Elderly",
    emoji: "👵",
    icon: Heart,
    desc: "Receive care & reminders",
    perks: ["Medicine reminders", "Health tracking", "SOS alerts", "Voice messages"],
  },
  {
    key: "caregiver",
    label: "Caregiver",
    emoji: "👩‍⚕️",
    icon: Stethoscope,
    desc: "Manage health records",
    perks: ["Manage multiple patients", "Add medicines & vitals", "Compliance reports", "Emergency alerts"],
  },
  {
    key: "family",
    label: "Family",
    emoji: "👨‍👩‍👧",
    icon: Users,
    desc: "Monitor loved ones",
    perks: ["Real-time health updates", "Medicine status check", "SOS notifications", "Voice messages"],
  },
];

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("elderly");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, role);
      navigate({ to: "/onboarding" });
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedRole = ROLES.find((r) => r.key === role)!;

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-10 overflow-hidden relative">
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full opacity-25 animate-blob"
        style={{ background: "radial-gradient(circle, #C89B3C 0%, #F3E6B3 60%, transparent 80%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-20 h-72 w-72 rounded-full opacity-20 animate-blob"
        style={{
          background: "radial-gradient(circle, #5B8F6A 0%, transparent 70%)",
          animationDelay: "4s",
        }}
      />

      <div className="w-full max-w-lg relative animate-card-reveal">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex flex-col items-center gap-2 group">
            <span className="relative grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow group-hover:scale-105 transition-transform duration-300">
              <Heart className="h-7 w-7" />
              <span className="absolute inset-0 rounded-2xl animate-pulse-ring" style={{ border: "2px solid #C89B3C" }} />
            </span>
            <span className="text-2xl font-bold tracking-tight">Sunaulo</span>
            <span className="text-sm text-muted-foreground">Caring Beyond Medicine</span>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-elevated">
          <h1 className="text-2xl font-bold tracking-tight text-center mb-1">Create your account</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Choose your role to unlock the right features
          </p>

          {/* Role cards */}
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
                      ? "border-primary bg-primary/10 text-primary scale-[1.04] shadow-soft"
                      : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary/60"
                  }`}
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="text-xl">{r.emoji}</span>
                  <span>{r.label}</span>
                  <span
                    className={`text-[10px] font-normal leading-tight text-center ${
                      active ? "text-primary/70" : "text-muted-foreground"
                    }`}
                  >
                    {r.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Role perks */}
          <div className="mb-5 p-3 rounded-xl bg-secondary/60 animate-slide-right">
            <p className="text-xs font-semibold text-primary mb-2">
              {selectedRole.emoji} As a {selectedRole.label} you get:
            </p>
            <div className="grid grid-cols-2 gap-1">
              {selectedRole.perks.map((perk) => (
                <div key={perk} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {perk}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="rounded-xl transition-shadow focus:shadow-glow"
              />
            </div>

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

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
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

              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input
                  id="confirm"
                  type={showPw ? "text" : "password"}
                  placeholder="Repeat password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="rounded-xl transition-shadow focus:shadow-glow"
                />
              </div>
            </div>

            {/* Password strength */}
            {password.length > 0 && (
              <div className="space-y-1 animate-card-reveal">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        password.length >= level * 3
                          ? level <= 1
                            ? "bg-destructive"
                            : level <= 2
                            ? "bg-warning"
                            : level <= 3
                            ? "bg-primary"
                            : "bg-success"
                          : "bg-border"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {password.length < 4
                    ? "Very weak"
                    : password.length < 7
                    ? "Weak"
                    : password.length < 10
                    ? "Good"
                    : "Strong"}{" "}
                  password
                </p>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3 animate-card-reveal flex items-start gap-2">
                <span className="shrink-0">⚠️</span>
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
                  Creating your account…
                </span>
              ) : (
                `Join as ${selectedRole.emoji} ${selectedRole.label}`
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
