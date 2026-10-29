"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    supportedEnv: "지원 환경:",
    supportedEnvValue: "iOS (TestFlight)",
    testAccount: "테스트 계정:",
    password: "비밀번호:",
    noticeText:
      "* 테스트 참여를 위해서는 TestFlight 앱이 먼저 설치되어 있어야 합니다.",
  },
  en: {
    supportedEnv: "Supported Env:",
    supportedEnvValue: "iOS (TestFlight)",
    testAccount: "Test Account:",
    password: "Password:",
    noticeText:
      "* The TestFlight app must be installed first to participate in testing.",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useIosDownloadLanguage() {
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
