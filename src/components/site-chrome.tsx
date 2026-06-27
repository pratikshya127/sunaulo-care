import { Link } from "@tanstack/react-router";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/#features", label: t("nav.features") },
    { to: "/#roles", label: t("nav.roles") },
    { to: "/#about", label: t("nav.about") },
  ];
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow group-hover:scale-105 transition">
            <Heart className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">Sunaulo</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/login">{t("nav.signin")}</Link>
          </Button>
          <Button asChild className="rounded-full shadow-glow">
            <Link to="/register">{t("nav.getStarted")}</Link>
          </Button>
        </div>
        <div className="md:hidden flex items-center gap-1">
          <LanguageSwitcher compact />
          <button
            aria-label="Toggle menu"
            className="grid h-10 w-10 place-items-center rounded-xl border border-border"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="px-4 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.to}
                onClick={() => setOpen(false)}
                className="text-base font-medium py-2"
              >
                {l.label}
              </a>
            ))}
            <Button asChild className="rounded-full mt-2">
              <Link to="/register">{t("nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const cols = [
    { title: "Product", links: ["Features", "Roles", "Dashboard", "Pricing"] },
    { title: "Company", links: ["About", "Contact", "Careers", "Press"] },
    { title: "Resources", links: ["Support", "Blog", "Help Center", "Community"] },
    { title: "Legal", links: ["Privacy Policy", "Terms", "Security", "Cookies"] },
  ];
  return (
    <footer className="border-t border-border bg-secondary/40 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                <Heart className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">Sunaulo</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Caring beyond medicine — smart healthcare for families, caregivers, and elderly.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-semibold text-sm mb-3">{c.title}</h4>
              <ul className="space-y-2">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Sunaulo Health. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#">Twitter</a>
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
