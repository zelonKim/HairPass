"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

import { getNaverAccount } from "@/api/auth/getNaverAccount";
import { useNaverAccountMutation } from "@/hooks/auth/useNaverAccountMutation";
import { NaverAccountData } from "@/types/auth/NaverAccountData";

export default function NaverAccountScreen() {
  const router = useRouter();

  const [naverId, setNaverId] = useState("");
  const [naverPw, setNaverPw] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  /////////////////////////////////////////////////////////////////////

  const { data: accountData, isLoading: isFetching } =
    useQuery<NaverAccountData>({
      queryKey: ["naverAccount"],
      queryFn: getNaverAccount,
    });

  useEffect(() => {
    if (accountData) {
      if (accountData.naver_id) setNaverId(accountData.naver_id);
      if (accountData.naver_pw) setNaverPw(accountData.naver_pw);
    }
  }, [accountData]);

  /////////////////////////////////////////////////////////////////////

  const { mutate: NaverAccountMutation, isPending: NaverAccountPending } =
    useNaverAccountMutation();

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    NaverAccountMutation({
      naver_id: naverId.trim(),
      naver_pw: naverPw.trim(),
    });
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <main className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-12 px-4 relative">
      <div className="absolute top-6 left-6 sm:left-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="cursor-pointer p-1 rounded-xl text-slate-700 hover:bg-blue-100 transition-colors"
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="w-6 h-6 text-[#35455b]" />
        </button>
      </div>

      <div className="max-w-md w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            네이버 계정 연동
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            자동 예약 실행 시 사용할 네이버 계정 정보를 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSaveAccount} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              계정 아이디
            </label>
            <input
              type="text"
              placeholder="아이디를 입력해주세요."
              value={naverId}
              onChange={(e) => setNaverId(e.target.value)}
              disabled={isFetching}
              autoCapitalize="none"
              autoCorrect="off"
              className="h-12 border border-gray-300 rounded-lg px-3.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#03C75A] focus:bg-white transition-all disabled:opacity-50 placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-800">
              계정 비밀번호
            </label>
            <div className="relative flex items-center h-12 border border-gray-300 rounded-lg bg-gray-50 focus-within:ring-1 focus-within:ring-[#03C75A] focus-within:bg-white transition-all">
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="비밀번호를 입력해주세요."
                value={naverPw}
                onChange={(e) => setNaverPw(e.target.value)}
                disabled={isFetching}
                autoCapitalize="none"
                className="flex-1 h-full px-3.5 text-sm bg-transparent text-gray-900 focus:outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="px-3.5 h-full flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="비밀번호 표시 전환"
              >
                {isPasswordVisible ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={NaverAccountPending || isFetching}
            className={`cursor-pointer h-12 rounded-lg font-bold text-white transition-colors flex items-center justify-center mt-3 shadow-sm ${
              NaverAccountPending || isFetching
                ? "bg-[#a0e8bb] cursor-not-allowed"
                : "bg-[#03C75A] hover:bg-[#02b350] active:bg-[#029e47]"
            }`}
          >
            {NaverAccountPending || isFetching ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-white" />
                <span>
                  {NaverAccountPending ? "저장 중..." : "불러오는 중..."}
                </span>
              </div>
            ) : (
              "계정 연동하기"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
