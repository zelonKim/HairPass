"use client";

import { useState, useEffect } from "react";

const translations = {
  ko: {
    // 공통/로그인
    appDownload: "앱 다운로드",
    loginSubtitle: "나를 위한 미용실 자동 예약 에이전트",
    usernameLabel: "아이디",
    usernamePlaceholder: "아이디를 입력해주세요.",
    passwordLabel: "비밀번호",
    passwordPlaceholder: "비밀번호를 입력해주세요.",
    loginButton: "로그인하기",
    noAccount: "아직 계정이 없으신가요?",
    loginLink: "회원가입",

    // 회원가입 전용
    signupHeaderTitle: "환영합니다💈",
    signupHeaderSubtitle: "앞으로 미용실 예약은 헤어패스에 맡겨요.",
    signupFormTitle: "가입 정보 입력",
    passwordConfirmLabel: "비밀번호 확인",
    passwordPlaceholderRules: "영문 + 숫자 8자 이상",
    passwordConfirmPlaceholder: "비밀번호를 다시 입력해주세요.",
    signupButton: "시작하기",
    alreadyHaveAccount: "이미 계정이 있으신가요?",
    loginButtonLink: "로그인하기",

    // 알럿 메시지
    alertUsernameEmpty: "아이디를 입력해 주세요.",
    alertPasswordEmpty: "비밀번호를 입력해 주세요.",
    alertPasswordMismatch: "비밀번호가 서로 일치하지 않습니다.",
    alertLoginEmpty: "아이디와 비밀번호를 모두 입력해 주세요.",
    alertLoginFail: "로그인 실패\n아이디 혹은 비밀번호가 올바르지 않습니다.",
  },
  en: {
    // Common/Login
    appDownload: "App Download",
    loginSubtitle: "Automated Hair Salon Booking Agent for You",
    usernameLabel: "Username",
    usernamePlaceholder: "Enter your username.",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password.",
    loginButton: "Log In",
    noAccount: "Don't have an account yet?",
    loginLink: "Sign Up",

    // Signup specific
    signupHeaderTitle: "Welcome 💈",
    signupHeaderSubtitle: "Leave your hair salon bookings to HairPass.",
    signupFormTitle: "Enter Account Details",
    passwordConfirmLabel: "Confirm Password",
    passwordPlaceholderRules: "At least 8 chars (letters & numbers)",
    passwordConfirmPlaceholder: "Re-enter your password.",
    signupButton: "Get Started",
    alreadyHaveAccount: "Already have an account?",
    loginButtonLink: "Log In",

    // Alert messages
    alertUsernameEmpty: "Please enter your username.",
    alertPasswordEmpty: "Please enter your password.",
    alertPasswordMismatch: "Passwords do not match.",
    alertLoginEmpty: "Please enter both username and password.",
    alertLoginFail: "Login Failed\nIncorrect username or password.",
  },
};

type Language = "ko" | "en";
type TranslationKey = keyof typeof translations.ko;

export function useSignupLanguage() {
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
