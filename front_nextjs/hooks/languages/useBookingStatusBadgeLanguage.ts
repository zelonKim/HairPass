"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    confirmed: "예약 확정",
    pending: "예약 대기",
    failed: "예약 실패",
  },
  en: {
    confirmed: "Confirmed",
    pending: "Pending",
    failed: "Failed",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useBookingStatusBadgeLanguage() {
  const [lang, setLang] = useState<Language>("ko");

  useEffect(() => {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLang("ko");
    } else {
      setLang("en");
    }
  }, []);

  const t = (key: TranslationKey): string => {
    return translations[lang][key] || translations.ko[key];
  };

  return { t, lang, setLang };
}
