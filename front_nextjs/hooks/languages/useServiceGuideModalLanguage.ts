"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    modalTitle: "💡 서비스 이용 방법",
    modalSubtitle: "HairPass를 더욱 스마트하게 이용하는 방법",
    confirmBtn: "닫기",
    steps: [
      {
        title: "네이버 계정 연동",
        description: "설정 탭에서 본인의 네이버 계정을 연동해주세요.",
      },
      {
        title: "예약 정보 입력 & 요청",
        description: "홈탭에서 원하는 예약 정보를 입력 후, 예약을 요청하세요.",
      },
      {
        title: "예약 성공 알림 대기",
        description: "AI 에이전트의 예약 성공 알림을 기다려주세요.",
      },
      {
        title: "네이버 예약 페이지 접속",
        description:
          "네이버 예약 페이지에 들어가 실제 예약 내역을 확인해주세요.",
      },
    ],
  },
  en: {
    modalTitle: "💡 How to Use Service",
    modalSubtitle: "Smart ways to make the most of HairPass",
    confirmBtn: "Close",
    steps: [
      {
        title: "Link Naver Account",
        description: "Please link your Naver account in the settings tab.",
      },
      {
        title: "Enter & Request Booking Info",
        description:
          "Enter your desired booking details on the home tab and request a booking.",
      },
      {
        title: "Wait for Booking Success Alert",
        description:
          "Please wait for the AI agent's booking success notification.",
      },
      {
        title: "Visit Naver Booking Page",
        description:
          "Go to the Naver booking page to check your actual reservation history.",
      },
    ],
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useServiceGuideModalLanguage() {
  const [lang, setLang] = useState<Language>("ko");

  useEffect(() => {
    const browserLang = navigator.language || (navigator as any).userLanguage;
    if (browserLang && browserLang.toLowerCase().startsWith("ko")) {
      setLang("ko");
    } else {
      setLang("en");
    }
  }, []);

  const t = (key: TranslationKey): any => {
    return translations[lang][key] || translations.ko[key];
  };

  return { t, lang, setLang };
}
