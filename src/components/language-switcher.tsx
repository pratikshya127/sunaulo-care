import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useI18n, type Lang } from "@/lib/i18n";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const label: Record<Lang, string> = { en: "EN", ne: "ने" };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "icon" : "sm"}
          className="rounded-full gap-1.5"
          aria-label={t("lang.label")}
        >
          <Languages className="h-4 w-4" />
          {!compact && <span className="text-sm font-semibold">{label[lang]}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuLabel>{t("lang.label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setLang("en")} className={lang === "en" ? "font-semibold text-primary" : ""}>
          🇬🇧 {t("lang.english")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLang("ne")} className={lang === "ne" ? "font-semibold text-primary" : ""}>
          🇳🇵 {t("lang.nepali")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
