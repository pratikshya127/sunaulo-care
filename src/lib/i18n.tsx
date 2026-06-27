import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ne";

type Dict = Record<string, string>;

const en: Dict = {
  "nav.home": "Home",
  "nav.features": "Features",
  "nav.roles": "Roles",
  "nav.about": "About",
  "nav.signin": "Sign in",
  "nav.getStarted": "Get Started",

  "hero.badge": "Trusted by 100+ families",
  "hero.title.a": "Caring",
  "hero.title.b": "Beyond",
  "hero.title.c": "Medicine.",
  "hero.subtitle":
    "Helping families, caregivers, and elderly stay connected through smart healthcare monitoring — every reminder, vital, and alert in one calm place.",
  "hero.cta.start": "Get Started",
  "hero.cta.learn": "Learn More",
  "hero.loved": "Loved by caregivers worldwide",

  "hero.card.medicine": "Medicine Reminder",
  "hero.card.monitoring": "Health Monitoring",
  "hero.card.sos": "SOS Emergency",
  "hero.card.family": "Family Notifications",
  "hero.float.nextDose": "Next dose",
  "hero.float.heart": "Heart Rate",
  "hero.float.normal": "Normal",
  "hero.float.sosReady": "SOS Ready",
  "hero.float.sosTap": "Tap for instant help",

  "about.tag": "Our Mission",
  "about.title": "Built so no elder is ever alone in their care.",
  "about.subtitle":
    "Sunaulo brings families, caregivers, and elderly together with quiet, dependable technology — soft reminders, clear vitals, and a single button for help when it matters most.",
  "about.stat.families": "Families Supported",
  "about.stat.monitoring": "Health Monitoring",
  "about.stat.compliance": "Medicine Compliance",
  "about.stat.alerts": "Emergency Alerts",
  "about.stat.realtime": "Real-Time",

  "features.tag": "Features",
  "features.title": "Everything you need to care, in one place.",
  "features.subtitle": "Twelve thoughtful tools designed for daily care — without the clinical clutter.",

  "roles.tag": "Built for Everyone",
  "roles.title": "Three dashboards. One connected family.",
  "roles.openDashboard": "Open Dashboard",

  "cta.title": "Start caring smarter today.",
  "cta.subtitle":
    "Join hundreds of families using Sunaulo to keep their loved ones safe, healthy, and connected.",
  "cta.open": "Open the Dashboard",
  "cta.see": "See features",

  "sidebar.care": "Care",
  "sidebar.dashboard": "Dashboard",
  "sidebar.records": "Health Records",
  "sidebar.medicine": "Medicine",
  "sidebar.voice": "Voice Messages",
  "sidebar.reports": "Reports",
  "sidebar.notifications": "Notifications",
  "sidebar.sos": "SOS",
  "sidebar.settings": "Settings",

  "lang.label": "Language",
  "lang.english": "English",
  "lang.nepali": "नेपाली",
};

const ne: Dict = {
  "nav.home": "गृह",
  "nav.features": "विशेषताहरू",
  "nav.roles": "भूमिकाहरू",
  "nav.about": "हाम्रोबारे",
  "nav.signin": "साइन इन",
  "nav.getStarted": "सुरु गर्नुहोस्",

  "hero.badge": "१००+ परिवारहरूको विश्वास",
  "hero.title.a": "औषधि",
  "hero.title.b": "भन्दा",
  "hero.title.c": "बढी हेरचाह।",
  "hero.subtitle":
    "परिवार, हेरचाहकर्ता र वृद्धवृद्धालाई स्मार्ट स्वास्थ्य अनुगमनद्वारा जोड्दै — हरेक सम्झना, महत्त्वपूर्ण सूचना र अलर्ट एकै शान्त ठाउँमा।",
  "hero.cta.start": "सुरु गर्नुहोस्",
  "hero.cta.learn": "थप जान्नुहोस्",
  "hero.loved": "विश्वभरका हेरचाहकर्ताको मनपर्ने",

  "hero.card.medicine": "औषधि सम्झना",
  "hero.card.monitoring": "स्वास्थ्य अनुगमन",
  "hero.card.sos": "आपतकालीन SOS",
  "hero.card.family": "पारिवारिक सूचना",
  "hero.float.nextDose": "अर्को मात्रा",
  "hero.float.heart": "मुटुको गति",
  "hero.float.normal": "सामान्य",
  "hero.float.sosReady": "SOS तयार",
  "hero.float.sosTap": "तुरुन्त सहयोगका लागि थिच्नुहोस्",

  "about.tag": "हाम्रो उद्देश्य",
  "about.title": "कुनै पनि वृद्ध एक्लो नरहून् भन्ने उद्देश्यले बनाइएको।",
  "about.subtitle":
    "सुनौलोले परिवार, हेरचाहकर्ता र वृद्धवृद्धालाई शान्त र भरपर्दो प्रविधिसँग जोड्दछ — मायालु सम्झना, स्पष्ट स्वास्थ्य तथ्याङ्क, र एकै थिचाइमा सहायता।",
  "about.stat.families": "सहयोग पाएका परिवार",
  "about.stat.monitoring": "स्वास्थ्य अनुगमन",
  "about.stat.compliance": "औषधि नियमितता",
  "about.stat.alerts": "आपतकालीन अलर्ट",
  "about.stat.realtime": "तत्काल",

  "features.tag": "विशेषताहरू",
  "features.title": "हेरचाहका लागि चाहिने सबै, एकै ठाउँमा।",
  "features.subtitle": "दैनिक हेरचाहका लागि सोचसम्झेर बनाइएका बाह्र उपकरणहरू।",

  "roles.tag": "सबैका लागि बनाइएको",
  "roles.title": "तीन ड्यासबोर्ड। एउटै जोडिएको परिवार।",
  "roles.openDashboard": "ड्यासबोर्ड खोल्नुहोस्",

  "cta.title": "आजै स्मार्ट हेरचाह सुरु गर्नुहोस्।",
  "cta.subtitle":
    "आफ्ना प्रियजनलाई सुरक्षित, स्वस्थ र जोडिएको राख्न सुनौलो प्रयोग गर्ने सयौं परिवारसँग जोडिनुहोस्।",
  "cta.open": "ड्यासबोर्ड खोल्नुहोस्",
  "cta.see": "विशेषता हेर्नुहोस्",

  "sidebar.care": "हेरचाह",
  "sidebar.dashboard": "ड्यासबोर्ड",
  "sidebar.records": "स्वास्थ्य अभिलेख",
  "sidebar.medicine": "औषधि",
  "sidebar.voice": "भ्वाइस सन्देश",
  "sidebar.reports": "रिपोर्ट",
  "sidebar.notifications": "सूचना",
  "sidebar.sos": "एसओएस",
  "sidebar.settings": "सेटिङ",

  "lang.label": "भाषा",
  "lang.english": "English",
  "lang.nepali": "नेपाली",
};

const dicts: Record<Lang, Dict> = { en, ne };

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const I18nContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "sunaulo.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "en" || saved === "ne") setLangState(saved);
    } catch {}
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
    if (typeof document !== "undefined") {
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback((k: string) => dicts[lang][k] ?? dicts.en[k] ?? k, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
