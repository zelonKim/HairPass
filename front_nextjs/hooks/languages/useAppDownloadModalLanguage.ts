"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    modalTitle: "HairPass 모바일 앱 💈",
    modalSubtitle: "원하시는 모바일 운영체제를 선택해 주세요",
    androidTab: "Android",
    iosTab: "iOS (iPhone)",
    confirmButton: "닫기",
  },
  en: {
    modalTitle: "HairPass Mobile App 💈",
    modalSubtitle: "Please select your mobile operating system",
    androidTab: "Android",
    iosTab: "iOS (iPhone)",
    confirmButton: "Close",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useAppDownloadModalLanguage() {
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
