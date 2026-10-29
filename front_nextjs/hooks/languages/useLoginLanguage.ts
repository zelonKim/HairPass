"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    appDownload: "앱 다운로드",
    subtitle: "나를 위한 미용실 자동 예약 에이전트",
    usernameLabel: "아이디",
    usernamePlaceholder: "아이디를 입력해주세요.",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력해주세요.",
    loginButton: "로그인하기",
    noAccount: "아직 계정이 없으신가요?",
    signup: "회원가입",
    alertEmpty: "아이디와 비밀번호를 모두 입력해 주세요.",
    alertFail: "로그인 실패\n아이디 혹은 비밀번호가 올바르지 않습니다.",
  },
  en: {
    appDownload: "App Download",
    subtitle: "Automated Hair Salon Booking Agent for You",
    usernameLabel: "Username",
    usernamePlaceholder: "Enter your username.",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password.",
    loginButton: "Log In",
    noAccount: "Don't have an account yet?",
    signup: "Sign Up",
    alertEmpty: "Please enter both username and password.",
    alertFail: "Login Failed\nIncorrect username or password.",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useLoginLanguage() {
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
