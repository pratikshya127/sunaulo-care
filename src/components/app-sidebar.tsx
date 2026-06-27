import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  HeartPulse,
  Pill,
  Mic,
  FileBarChart,
  Bell,
  ShieldAlert,
  Settings,
  Heart,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { useAuth, type Role } from "@/lib/auth";

const ALL_ITEMS = [
  {
    key: "sidebar.dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["elderly", "caregiver", "family"] as Role[],
  },
  {
    key: "sidebar.records",
    url: "/dashboard/records",
    icon: HeartPulse,
    roles: ["caregiver", "family"] as Role[],
  },
  {
    key: "sidebar.medicine",
    url: "/dashboard/medicine",
    icon: Pill,
    roles: ["elderly", "caregiver", "family"] as Role[],
  },
  {
    key: "sidebar.voice",
    url: "/dashboard/voice",
    icon: Mic,
    roles: ["elderly", "caregiver", "family"] as Role[],
  },
  {
    key: "sidebar.reports",
    url: "/dashboard/reports",
    icon: FileBarChart,
    roles: ["caregiver", "family"] as Role[],
  },
  {
    key: "sidebar.notifications",
    url: "/dashboard/notifications",
    icon: Bell,
    roles: ["elderly", "caregiver", "family"] as Role[],
  },
  {
    key: "sidebar.sos",
    url: "/dashboard/sos",
    icon: ShieldAlert,
    roles: ["elderly", "caregiver", "family"] as Role[],
  },
  {
    key: "sidebar.settings",
    url: "/dashboard/settings",
    icon: Settings,
    roles: ["elderly", "caregiver", "family"] as Role[],
  },
];

const ROLE_LABELS: Record<Role, string> = {
  elderly: "Elderly",
  caregiver: "Caregiver",
  family: "Family Member",
};

export function AppSidebar() {
  const { state } = useSidebar();
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  const role = user?.role ?? "elderly";
  const items = ALL_ITEMS.filter((i) => i.roles.includes(role));

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  async function handleLogout() {
    await logout();
    navigate({ to: "/login" });
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
            <Heart className="h-5 w-5" />
          </span>
          {!collapsed && <span className="text-lg font-bold tracking-tight">Sunaulo</span>}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>{t("sidebar.care")}</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = isActive(item.url);
                const label = t(item.key);
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={label}
                      className={
                        active
                          ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                          : ""
                      }
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span>{label}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && !collapsed && (
          <div className="mx-2 mb-2 flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">{ROLE_LABELS[role]}</p>
            </div>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Sign out"
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
