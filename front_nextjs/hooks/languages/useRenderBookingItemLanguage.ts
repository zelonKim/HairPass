// hooks/useRenderBookingItemLanguage.ts
"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    noSalonInfo: "미용실 정보 없음",
    deleteConfirm: "해당 예약을 삭제하시겠습니까?",
    deleteTitle: "예약 삭제",
    teacherSuffix: "쌤",
    npayPayment: "네이버페이 결제",
    onsitePayment: "카드 및 현금 결제",
  },
  en: {
    noSalonInfo: "No Salon Info",
    deleteConfirm: "Are you sure you want to delete this booking?",
    deleteTitle: "Delete Booking",
    teacherSuffix: "Stylist",
    npayPayment: "Naver Pay",
    onsitePayment: "Card / Cash",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useRenderBookingItemLanguage() {
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
