"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, UserRound, Loader2 } from "lucide-react";

import { useSignupMutation } from "@/hooks/auth/useSignupMutation";

export default function SignupScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  /////////////////////////////////////////////////////////////////////

  const { mutate: signupMutation, isPending: signupPending } =
    useSignupMutation();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      window.alert("아이디를 입력해 주세요.");
      return;
    }
    if (!password) {
      window.alert("비밀번호를 입력해 주세요.");
      return;
    }
    if (password !== passwordConfirm) {
      window.alert("비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    signupMutation({
      username: username.trim(),
      password,
      password_confirm: passwordConfirm,
    });
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <main className="min-h-screen bg-blue-50  flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* 헤더 섹션 */}
        <div className="mb-6 px-2">
          <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight mb-1">
            환영합니다💈
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            앞으로 미용실 예약은 헤어패스에 맡겨요.
          </p>
        </div>

        {/* 회원가입 폼 카드 */}
        <form
          onSubmit={handleSignup}
          className="bg-white rounded-3xl p-7 border border-gray-200 shadow-sm"
        >
          <h2 className="text-base font-bold text-gray-900 mb-4">
            가입 정보 입력
          </h2>

          {/* 아이디 */}
          <label className="block text-[13px] font-semibold text-gray-500 mb-1.5">
            아이디
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <UserRound className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
            <input
              type="text"
              className="w-full py-3 text-[15px] text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력해주세요."
              autoCapitalize="none"
            />
          </div>

          {/* 비밀번호 */}
          <label className="block text-[13px] font-semibold text-gray-500 mt-5 mb-1.5">
            비밀번호
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <Lock className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
            <input
              type="password"
              className="w-full py-3 text-[15px] text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="영문 + 숫자 8자 이상"
              autoCapitalize="none"
            />
          </div>

          {/* 비밀번호 확인 */}
          <label className="block text-[13px] font-semibold text-gray-500 mt-5 mb-1.5">
            비밀번호 확인
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <Lock className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
            <input
              type="password"
              className="w-full py-3 text-[15px] text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="비밀번호를 다시 입력해주세요."
              autoCapitalize="none"
            />
          </div>

          {/* 가입 버튼 */}
          <button
            type="submit"
            disabled={signupPending}
            className="cursor-pointer w-full mt-7 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 shadow-sm"
          >
            {signupPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              "시작하기"
            )}
          </button>

          {/* 로그인 이동 링크 */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-gray-500">
              이미 계정이 있으신가요?{" "}
              <Link
                href="/login"
                className="text-blue-600 font-bold hover:underline"
              >
                로그인하기
              </Link>
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
