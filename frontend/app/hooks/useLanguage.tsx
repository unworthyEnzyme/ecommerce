import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "usehooks-ts";
import { translations, type Language } from "../translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, section?: "common" | "product") => string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useLocalStorage<Language>("language", "en");

  const t = (key: string, section: "common" | "product" = "common") => {
    const keys = key.split(".");
    let value: any = translations[language][section];

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k as keyof typeof value];
      }
    }

    if (typeof value !== "string") {
      return key; // Return the key if we didn't find a valid string translation
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
