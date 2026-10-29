"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    modalTitle: "⚠️ 서비스 이용 주의사항",
    modalSubtitle: "서비스 이용 전에 아래 내용을 필독해주세요.",
    confirmBtn: "닫기",
    cautions: [
      {
        title: "실제 예약 확인",
        description:
          "실제 예약 여부는 최종적으로 반드시 네이버 예약 페이지를 통해 확인하여야 하며, 이를 확인하지 않아 생긴 불이익은 본인의 책임입니다.",
      },
      {
        title: "예약 취소 및 변경",
        description:
          "확정된 예약의 취소 및 변경은 네이버 예약 페이지를 통해 직접 진행해 주셔야 합니다.",
      },
      {
        title: "예약 실패",
        description:
          "이미 예약이 찼거나, 해당 디자이너가 근무하지 않는 날짜 및 시간에 예약을 요청할 경우, 예약에 실패할 수 있습니다.",
      },
    ],
  },
  en: {
    modalTitle: "⚠️ Service Cautions",
    modalSubtitle:
      "Please read the following carefully before using the service.",
    confirmBtn: "Close",
    cautions: [
      {
        title: "Check Actual Reservation",
        description:
          "You must confirm the actual booking status on the Naver Booking page. Users are responsible for any disadvantages caused by failing to do so.",
      },
      {
        title: "Cancellation & Changes",
        description:
          "Cancellation or modification of confirmed bookings must be done directly through the Naver Booking page.",
      },
      {
        title: "Booking Failures",
        description:
          "Bookings may fail if requested for a fully booked slot or a date/time when the stylist is off duty.",
      },
    ],
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useServiceCautionModalLanguage() {
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
