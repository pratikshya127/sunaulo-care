import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "elderly" | "caregiver" | "family";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
};

type AuthCtx = AuthState & {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: Role) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export const API_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
  "http://localhost:8000/api";

export async function apiFetch(path: string, options?: RequestInit) {
  const token = typeof window !== "undefined" ? localStorage.getItem("sunaulo.token") : null;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options?.headers as Record<string, string>) ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data.message ??
      (data.errors ? Object.values(data.errors).flat().join(" ") : "Request failed");
    throw new Error(msg as string);
  }
  return data;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("sunaulo.token");
    const raw = localStorage.getItem("sunaulo.user");
    if (token && raw) {
      try {
        setState({ user: JSON.parse(raw) as User, token, loading: false });
      } catch {
        setState({ user: null, token: null, loading: false });
      }
    } else {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const user = data.user as User;
    const token = data.token as string;
    localStorage.setItem("sunaulo.token", token);
    localStorage.setItem("sunaulo.user", JSON.stringify(user));
    setState({ user, token, loading: false });
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: Role) => {
      const data = await apiFetch("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, password_confirmation: password, role }),
      });
      const user = data.user as User;
      const token = data.token as string;
      localStorage.setItem("sunaulo.token", token);
      localStorage.setItem("sunaulo.user", JSON.stringify(user));
      setState({ user, token, loading: false });
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("sunaulo.token");
    localStorage.removeItem("sunaulo.user");
    setState({ user: null, token: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
