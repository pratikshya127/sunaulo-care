import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Eye, EyeOff } from "lucide-react";
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

const ROLES: { key: Role; label: string; emoji: string }[] = [
  { key: "elderly", label: "Elderly", emoji: "👵" },
  { key: "caregiver", label: "Caregiver", emoji: "👩‍⚕️" },
  { key: "family", label: "Family", emoji: "👨‍👩‍👧" },
];

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
          <h1 className="text-2xl font-bold tracking-tight text-center mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Sign in to your account
          </p>

          {/* Role tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1 rounded-2xl bg-secondary/60">
            {ROLES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRole(r.key)}
                className={`flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  role === r.key
                    ? "bg-card shadow-soft text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="text-xl">{r.emoji}</span>
                {r.label}
              </button>
            ))}
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
                className="rounded-xl"
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
                ? "Signing in…"
                : `Sign in as ${selectedRole.emoji} ${selectedRole.label}`}
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
