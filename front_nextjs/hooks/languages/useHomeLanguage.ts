"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    headerTitle: "미용실 예약 요청",
    headerSubtitle: "AI 에이전트가 대신 미용실을 예약해 줄게요.",
    salonNameLabel: "미용실 이름",
    salonNamePlaceholder: "예) 박준뷰티랩 청담점",
    designerNameLabel: "담당 디자이너",
    designerNamePlaceholder: "예) 한별쌤",
    menuNameLabel: "시술 메뉴",
    menuNamePlaceholder: "예) 뿌리염색",
    bookingDateLabel: "예약 날짜",
    bookingDatePlaceholder: "날짜를 선택해주세요.",
    bookingTimeLabel: "예약 시간",
    bookingTimePlaceholder: "시간을 선택해주세요.",
    paymentMethodLabel: "결제 수단",
    npay: "네이버 페이",
    onsite: "카드 및 현금",
    submitButton: "미용실 예약 요청하기",

    alertIncomplete: "예약 정보를 모두 입력해 주세요",
    confirmNaverLink:
      "자동 예약을 위해 최초 1회 네이버 계정 연동이 필요합니다. 연동 페이지로 이동하시겠습니까?",
  },
  en: {
    headerTitle: "Hair Salon Reservation Request",
    headerSubtitle: "AI Agent will handle your hair salon booking for you.",
    salonNameLabel: "Salon Name",
    salonNamePlaceholder: "e.g. Park Jun Beauty Lab Cheongdam",
    designerNameLabel: "Stylist Name",
    designerNamePlaceholder: "e.g. Designer Hanbyul",
    menuNameLabel: "Service Menu",
    menuNamePlaceholder: "e.g. Root Touch-up",
    bookingDateLabel: "Reservation Date",
    bookingDatePlaceholder: "Please select a date.",
    bookingTimeLabel: "Reservation Time",
    bookingTimePlaceholder: "Please select a time.",
    paymentMethodLabel: "Payment Method",
    npay: "Naver Pay",
    onsite: "Card / Cash ",
    submitButton: "Request Hair Salon Reservation",

    alertIncomplete: "Please fill in all reservation details.",
    confirmNaverLink:
      "Initial 1-time Naver account linkage is required for automated booking. Move to the account setup page?",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useHomeLanguage() {
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
