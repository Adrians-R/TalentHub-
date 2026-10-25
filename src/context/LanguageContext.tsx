/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, Translations, translations, formatRupiah, formatRupiahCompact } from "../i18n/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof Translations, fallback?: string) => string;
  formatCurrency: (amount: number | string, period?: "month" | "year" | "bln" | "thn") => string;
  formatCompactCurrency: (amount: number) => string;
  isIndonesian: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "talenthub_preferred_language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Default to Indonesian (id) or user's saved preference
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === "id" || saved === "en") {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return "id"; // Default to Indonesian
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "id" ? "en" : "id");
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: keyof Translations, fallback?: string): string => {
    const currentDict = translations[language] || translations.id;
    if (key in currentDict) {
      return currentDict[key];
    }
    return fallback || key;
  };

  const formatCurrency = (amount: number | string, period?: "month" | "year" | "bln" | "thn"): string => {
    return formatRupiah(amount, period, language);
  };

  const formatCompactCurrency = (amount: number): string => {
    return formatRupiahCompact(amount, language);
  };

  const isIndonesian = language === "id";

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
        formatCurrency,
        formatCompactCurrency,
        isIndonesian,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
