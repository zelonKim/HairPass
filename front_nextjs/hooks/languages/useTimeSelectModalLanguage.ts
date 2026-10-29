"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    modalTitle: "예약 시간 선택",
    amLabel: "오전",
    pmLabel: "오후",
    closeBtn: "닫기",
  },
  en: {
    modalTitle: "Reservation Time",
    amLabel: "AM",
    pmLabel: "PM",
    closeBtn: "Close",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useTimeSelectModalLanguage() {
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
