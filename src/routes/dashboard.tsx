import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Search, Moon, Sun, Heart } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SOSButton } from "@/components/sos-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !localStorage.getItem("sunaulo.token")) {
      throw redirect({ to: "/login" });
    }
  },
  head: () => ({
    meta: [
      { title: "Dashboard — Sunaulo" },
      { name: "description", content: "Sunaulo elderly care dashboard." },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow animate-pulse">
            <Heart className="h-7 w-7" />
          </span>
          <p className="text-sm text-muted-foreground font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SidebarProvider>
      <div className="min-h-dvh flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 sticky top-0 z-30 flex items-center gap-2 sm:gap-4 px-3 sm:px-6 border-b border-border bg-background/80 backdrop-blur-xl">
            <SidebarTrigger />
            <div className="relative flex-1 max-w-md hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records, medicines, reports…"
                className="pl-9 rounded-full bg-secondary/70 border-transparent focus-visible:bg-background"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <LanguageSwitcher compact />
              <SOSButton compact />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggle}
                aria-label="Toggle dark mode"
                className="rounded-full"
              >
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full relative"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
