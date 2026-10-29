"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    headerTitle: "나의 즐겨찾기",
    headerSubtitle: "즐겨찾기를 설정하면 기본 예약 정보로 등록돼요.",
    loadingText: "선호 정보를 불러오는 중...",
    errorText: "정보를 불러오지 못했습니다.",
    retryBtn: "다시 시도",
    salonLabel: "단골 미용실",
    salonPlaceholder: "미용실 이름을 입력해주세요",
    designerLabel: "선호 디자이너",
    designerPlaceholder: "디자이너 이름을 입력해주세요.",
    menuLabel: "자주 받는 시술 메뉴",
    menuPlaceholder: "시술 메뉴 이름을 입력해주세요.",
    saveBtn: "즐겨찾기 저장하기",
  },
  en: {
    headerTitle: "My Favorites",
    headerSubtitle:
      "Saved favorites will be filled in as your default booking info.",
    loadingText: "Loading favorite preferences...",
    errorText: "Failed to load information.",
    retryBtn: "Retry",
    salonLabel: "Favorite Salon",
    salonPlaceholder: "Enter salon name",
    designerLabel: "Favorite Stylist",
    designerPlaceholder: "Enter stylist name",
    menuLabel: "Frequent Service Menu",
    menuPlaceholder: "Enter service menu name",
    saveBtn: "Save Favorites",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useFavoritesLanguage() {
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
