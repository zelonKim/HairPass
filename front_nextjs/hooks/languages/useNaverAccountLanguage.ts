// hooks/useNaverAccountLanguage.ts
"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    backButtonAria: "뒤로 가기",
    headerTitle: "네이버 계정 연동",
    headerSubtitle:
      "자동 예약 실행 시 사용할 네이버 계정 정보를 입력해 주세요.",
    idLabel: "계정 아이디",
    idPlaceholder: "아이디를 입력해주세요.",
    pwLabel: "계정 비밀번호",
    pwPlaceholder: "비밀번호를 입력해주세요.",
    pwToggleAria: "비밀번호 표시 전환",
    savingText: "저장 중...",
    loadingText: "불러오는 중...",
    submitButton: "계정 연동하기",
  },
  en: {
    backButtonAria: "Go back",
    headerTitle: "Link Naver Account",
    headerSubtitle:
      "Please enter your Naver account info to be used for automated booking.",
    idLabel: "Account ID",
    idPlaceholder: "Please enter your ID.",
    pwLabel: "Account Password",
    pwPlaceholder: "Please enter your password.",
    pwToggleAria: "Toggle password visibility",
    savingText: "Saving...",
    loadingText: "Loading...",
    submitButton: "Link Account",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useNaverAccountLanguage() {
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
