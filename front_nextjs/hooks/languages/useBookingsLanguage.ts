// hooks/useBookingsLanguage.ts
"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    headerTitle: "나의 예약 내역",
    refreshTitle: "새로고침",
    naverBookingBtn: "네이버 예약",
    loadingText: "예약 내역을 불러오는 중...",
    errorText: "예약 목록을 가져올 수 없습니다.",
    retryBtn: "다시 시도",
    emptyTitle: "아직 예약된 내역이 없습니다.",
    emptySubtitle: "홈에서 원하는 미용실을 바로 예약해보세요!",
  },
  en: {
    headerTitle: "My Bookings",
    refreshTitle: "Refresh",
    naverBookingBtn: "Naver Booking",
    loadingText: "Loading booking history...",
    errorText: "Failed to load booking list.",
    retryBtn: "Retry",
    emptyTitle: "No bookings found yet.",
    emptySubtitle: "Book your favorite salon directly from the home screen!",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useBookingsLanguage() {
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