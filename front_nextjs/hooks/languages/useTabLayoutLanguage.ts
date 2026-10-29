"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    home: "홈",
    bookings: "예약 내역",
    favorites: "즐겨찾기",
    settings: "설정",
  },
  en: {
    home: "Home",
    bookings: "Bookings",
    favorites: "Favorites",
    settings: "Settings",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useTabLayoutLanguage() {
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
