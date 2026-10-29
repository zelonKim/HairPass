// hooks/useAndroidDownloadLanguage.ts
"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    supportedEnv: "지원 환경:",
    supportedEnvValue: "Android (APK)",
    testAccount: "테스트 계정:",
    password: "비밀번호:",
    noticeText:
      "* 다운로드 중 '출처를 알 수 없는 앱' 경고 발생 시, '무시하고 설치하기' 버튼을 눌러주세요.",
  },
  en: {
    supportedEnv: "Supported Env:",
    supportedEnvValue: "Android (APK)",
    testAccount: "Test Account:",
    password: "Password:",
    noticeText:
      "* If a 'Unknown sources' warning appears during download, click 'Install anyway'.",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useAndroidDownloadLanguage() {
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
