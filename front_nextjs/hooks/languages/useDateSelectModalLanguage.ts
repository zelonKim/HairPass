"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    weekDays: ["일", "월", "화", "수", "목", "금", "토"],
    closeBtn: "닫기",
    formatYearMonth: (year: number, month: number) => `${year}년 ${month + 1}월`,
  },
  en: {
    weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    closeBtn: "Close",
    formatYearMonth: (year: number, month: number) => {
      const date = new Date(year, month, 1);
      return date.toLocaleString("en-US", { month: "long", year: "numeric" });
    },
  },
};

type Language = "ko" | "en";

export function useDateSelectModalLanguage() {
  const [lang, setLang] = useState<Language>("ko");

  useEffect(() => {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLang("ko");
    } else {
      setLang("en");
    }
  }, []);

  const t = translations[lang] || translations.ko;

  return { t, lang, setLang };
}