import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Eye, EyeOff } from "lucide-react";
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

const ROLES: { key: Role; label: string; emoji: string; desc: string }[] = [
  { key: "elderly", label: "Elderly", emoji: "👵", desc: "Receive care & reminders" },
  { key: "caregiver", label: "Caregiver", emoji: "👩‍⚕️", desc: "Manage health records" },
  { key: "family", label: "Family", emoji: "👨‍👩‍👧", desc: "Monitor loved ones" },
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
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const selectedRole = ROLES.find((r) => r.key === role)!;

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2 group">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow group-hover:scale-105 transition">
              <Heart className="h-7 w-7" />
            </span>
            <span className="text-2xl font-bold tracking-tight">Sunaulo</span>
            <span className="text-sm text-muted-foreground">Caring Beyond Medicine</span>
          </Link>
        </div>

        <div className="glass-card rounded-3xl p-8 shadow-elevated">
          <h1 className="text-2xl font-bold tracking-tight text-center mb-1">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Choose your role to get started
          </p>

          {/* Role cards */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 text-xs font-semibold transition-all ${
                  role === r.key
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className="text-2xl">{r.emoji}</span>
                <span>{r.label}</span>
                <span
                  className={`text-[10px] font-normal leading-tight text-center ${
                    role === r.key ? "text-primary/70" : "text-muted-foreground"
                  }`}
                >
                  {r.desc}
                </span>
              </button>
            ))}
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
                className="rounded-xl"
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
                className="rounded-xl"
              />
            </div>

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
                  className="rounded-xl pr-10"
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
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                className="rounded-xl"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="w-full rounded-full h-11 text-base shadow-glow"
              disabled={loading}
            >
              {loading
                ? "Creating account…"
                : `Join as ${selectedRole.emoji} ${selectedRole.label}`}
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
