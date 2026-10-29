// hooks/useSettingsLanguage.ts
"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    headerTitle: "나의 설정",
    currentAccount: "접속중인 계정",
    defaultUser: "사용자",
    appSettings: "앱 설정",
    serviceGuide: "서비스 안내",
    accountManagement: "계정 관리",
    naverLink: "네이버 계정 연동하기",
    linked: "연동 완료",
    unlinked: "미연동",
    serviceUsageGuide: "서비스 이용 방법",
    serviceCaution: "서비스 이용 주의사항",
    logout: "로그아웃",
    withdraw: "회원 탈퇴",
    confirmNaverReset:
      "이미 연동된 네이버 계정이 있습니다. 새로운 계정을 연동하시겠습니까?",
    confirmWithdraw:
      "⚠️ 회원 탈퇴\n탈퇴 시 모든 정보가 삭제되며 이를 복구할 수 없습니다. 정말 탈퇴하시겠습니까?",
    confirmLogout: "로그아웃\n정말 로그아웃 하시겠습니까?",
    alertLogoutError: "로그아웃 처리 중 문제가 발생했습니다.",
  },
  en: {
    headerTitle: "Settings",
    currentAccount: "Logged in Account",
    defaultUser: "User",
    appSettings: "App Settings",
    serviceGuide: "Service Guide",
    accountManagement: "Account Management",
    naverLink: "Link Naver Account",
    linked: "Linked",
    unlinked: "Unlinked",
    serviceUsageGuide: "How to Use Service",
    serviceCaution: "Service Cautions",
    logout: "Log Out",
    withdraw: "Delete Account",
    confirmNaverReset:
      "A Naver account is already linked. Would you like to link a new account?",
    confirmWithdraw:
      "⚠️ Delete Account\nAll information will be deleted and cannot be recovered. Are you sure you want to delete your account?",
    confirmLogout: "Log Out\nAre you sure you want to log out?",
    alertLogoutError: "An error occurred while logging out.",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useSettingsLanguage() {
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
