import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-care.jpg";
import {
  Pill,
  Activity,
  ShieldAlert,
  BellRing,
  Heart,
  Mic,
  FileBarChart,
  Moon,
  Droplets,
  Gauge,
  Sparkles,
  Weight,
  Users,
  Stethoscope,
  HeartHandshake,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sunaulo — Caring Beyond Medicine" },
      {
        name: "description",
        content:
          "Helping families, caregivers, and elderly stay connected through smart healthcare monitoring, medicine reminders, and SOS alerts.",
      },
      { property: "og:title", content: "Sunaulo — Caring Beyond Medicine" },
      {
        property: "og:description",
        content:
          "Premium elderly care platform with medicine reminders, vitals tracking, and emergency alerts.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <Hero />
      <About />
      <Features />
      <Roles />
      <CTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  const floatCards = [
    { icon: Pill, label: t("hero.card.medicine"), tone: "bg-primary/10 text-primary" },
    { icon: Activity, label: t("hero.card.monitoring"), tone: "bg-teal/15 text-teal" },
    { icon: ShieldAlert, label: t("hero.card.sos"), tone: "bg-destructive/10 text-destructive" },
    { icon: BellRing, label: t("hero.card.family"), tone: "bg-warning/15 text-warning" },
  ];
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5" /> {t("hero.badge")}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              {t("hero.title.a")} <span className="text-gradient">{t("hero.title.b")}</span> {t("hero.title.c")}
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full h-12 px-7 text-base shadow-glow">
                <Link to="/dashboard">
                  {t("hero.cta.start")} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-7 text-base border-2"
              >
                <a href="#features">{t("hero.cta.learn")}</a>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {["👵", "👨‍⚕️", "👩‍⚕️", "👴"].map((e) => (
                  <div
                    key={e}
                    className="h-10 w-10 rounded-full border-2 border-background bg-secondary grid place-items-center text-lg"
                  >
                    {e}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-warning">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("hero.loved")}
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-[2rem] overflow-hidden shadow-elevated border border-border/60">
              <img
                src={heroImg}
                width={1536}
                height={1280}
                alt="An elderly woman smiling while being cared for by a family member"
                className="w-full h-[520px] lg:h-[640px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
            </div>

            {/* Floating cards */}
            <div className="absolute -left-4 sm:-left-8 top-12 glass-card rounded-2xl p-4 w-56 hidden sm:block animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Pill className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">{t("hero.float.nextDose")}</p>
                  <p className="text-sm font-semibold">Metformin · 8:00 AM</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 glass-card rounded-2xl p-4 w-60 hidden md:block">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{t("hero.float.heart")}</p>
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {t("hero.float.normal")}
                </span>
              </div>
              <p className="text-2xl font-bold">
                72 <span className="text-sm font-normal text-muted-foreground">bpm</span>
              </p>
              <div className="mt-2 flex items-end gap-1 h-8">
                {[40, 60, 35, 80, 55, 70, 45, 65, 50, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-primary to-teal"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="absolute -bottom-4 sm:-bottom-6 left-6 sm:left-10 glass-card rounded-2xl p-4 w-64 hidden sm:block">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{t("hero.float.sosReady")}</p>
                  <p className="text-xs text-muted-foreground">{t("hero.float.sosTap")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature pill row */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {floatCards.map((c) => (
            <div
              key={c.label}
              className="glass-card rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 transition"
            >
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.tone}`}>
                <c.icon className="h-5 w-5" />
              </span>
              <span className="text-sm font-semibold">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const { t } = useI18n();
  const stats = [
    { value: "100+", label: t("about.stat.families") },
    { value: "24/7", label: t("about.stat.monitoring") },
    { value: "98%", label: t("about.stat.compliance") },
    { value: t("about.stat.realtime"), label: t("about.stat.alerts") },
  ];
  return (
    <section id="about" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-xs font-semibold mb-4">
            {t("about.tag")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {t("about.title")}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            {t("about.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass-card rounded-3xl p-6 sm:p-8 text-center hover:shadow-elevated transition"
            >
              <p className="text-3xl sm:text-5xl font-extrabold text-gradient">{s.value}</p>
              <p className="mt-2 text-sm text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useI18n();
  const features = [
    { icon: Pill, name: "Medicine Reminder", desc: "Never miss a dose with smart alerts." },
    { icon: Activity, name: "Health Tracking", desc: "All vitals in one calm dashboard." },
    { icon: Mic, name: "Voice Messages", desc: "Stay close with a simple recording." },
    { icon: ShieldAlert, name: "Emergency SOS", desc: "One tap to alert everyone who matters." },
    { icon: BellRing, name: "Family Notifications", desc: "Soft updates that keep loved ones informed." },
    { icon: HeartHandshake, name: "Caregiver Updates", desc: "Daily notes from the care team." },
    { icon: FileBarChart, name: "Health Reports", desc: "Beautiful weekly summaries." },
    { icon: Moon, name: "Sleep Tracking", desc: "Understand rest patterns deeply." },
    { icon: Droplets, name: "Water Intake", desc: "Hydration nudges through the day." },
    { icon: Gauge, name: "Blood Pressure", desc: "Trends, ranges, and gentle alerts." },
    { icon: Sparkles, name: "Sugar Level", desc: "Track glucose with clarity." },
    { icon: Weight, name: "Weight Monitoring", desc: "Spot changes before they matter." },
  ];
  return (
    <section id="features" className="py-24 lg:py-32 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            {t("features.tag")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {t("features.subtitle")}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => (
            <div
              key={f.name}
              className="group glass-card rounded-3xl p-6 hover:-translate-y-1 hover:shadow-elevated transition-all"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary to-teal text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold">{f.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roles() {
  const { t } = useI18n();
  const roles = [
    {
      emoji: "👵",
      title: "Elderly Dashboard",
      tag: "Simple. Calm. Friendly.",
      tone: "from-primary/15 to-primary/5",
      items: [
        "Large, easy buttons",
        "Medicine reminders",
        "Voice messages",
        "Emergency SOS",
        "Gentle notifications",
      ],
    },
    {
      emoji: "👩‍⚕️",
      title: "Caregiver Dashboard",
      tag: "Manage care with clarity.",
      tone: "from-teal/15 to-teal/5",
      items: [
        "Manage elderly profiles",
        "Update health records",
        "Medicine schedules",
        "Daily observations",
        "Detailed health reports",
      ],
    },
    {
      emoji: "👨‍👩‍👧",
      title: "Family Dashboard",
      tag: "Peace of mind, anywhere.",
      tone: "from-warning/15 to-warning/5",
      items: [
        "Live health charts",
        "Medicine compliance",
        "Real-time notifications",
        "Caregiver updates",
        "Emergency alerts",
      ],
    },
  ];
  return (
    <section id="roles" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14 text-center mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-teal/10 text-teal text-xs font-semibold mb-4">
            {t("roles.tag")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            {t("roles.title")}
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {roles.map((r) => (
            <div
              key={r.title}
              className={`relative rounded-3xl p-8 border border-border bg-gradient-to-br ${r.tone} backdrop-blur-sm hover:-translate-y-2 hover:shadow-elevated transition-all`}
            >
              <div className="text-5xl mb-4">{r.emoji}</div>
              <h3 className="text-2xl font-bold">{r.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{r.tag}</p>
              <ul className="mt-6 space-y-3">
                {r.items.map((i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {i}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant="outline"
                className="mt-8 rounded-full border-2 w-full"
              >
                <Link to="/dashboard">{t("roles.openDashboard")}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const { t } = useI18n();
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary via-primary to-teal p-10 sm:p-16 text-primary-foreground">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <Users className="h-10 w-10 mb-4 opacity-90" />
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="mt-4 text-lg opacity-90">
              {t("cta.subtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full h-12 px-7 text-base"
              >
                <Link to="/dashboard">{t("cta.open")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full h-12 px-7 text-base bg-transparent border-white/40 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
              >
                <a href="#features">
                  <Stethoscope className="mr-1 h-4 w-4" /> {t("cta.see")}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
