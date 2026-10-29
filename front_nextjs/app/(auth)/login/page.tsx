"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { Lock, UserRound, Loader2, Smartphone } from "lucide-react";
import { loginApi } from "@/api/auth/loginApi";
import { setAccessToken } from "@/api/token";
import HairPassIcon from "@/public/HairPass_icon.png";
import { AppDownloadModal } from "@/components/AppDownloadModal";
import { useLoginLanguage } from "@/hooks/languages/useLoginLanguage";

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useLoginLanguage(); // 변경된 훅 호출

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  /////////////////////////////////////////////////////////////////////

  const { mutate: loginMutation, isPending: loginPending } = useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      if (data.token) {
        await setAccessToken(data.token);
      }
      router.replace("/");
    },
    onError: () => {
      window.alert(t("alertFail"));
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      window.alert(t("alertEmpty"));
      return;
    }
    loginMutation({
      username: username.trim(),
      password,
    });
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <main className="min-h-screen bg-blue-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-md w-full ">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer absolute top-6 right-6 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm border active:scale-[0.98] 
          bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 shadow-gray-100"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-500" />
          {t("appDownload")}
        </button>

        {/* 헤더 및 로고 섹션 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full mb-4 shadow-blue-300 shadow-md flex items-center justify-center overflow-hidden">
            <Image
              src={HairPassIcon}
              alt="HairPass Logo"
              width={88}
              height={88}
              className="object-cover rounded-full w-full h-full"
              priority
            />
          </div>
          <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight mb-1.5 drop-shadow-sm shadow-blue-400">
            HairPass
          </h1>
          <p className="text-sm text-gray-500 font-medium text-center">
            {t("subtitle")}
          </p>
        </div>

        {/* 로그인 폼 카드 */}
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm"
        >
          {/* 아이디 입력 */}
          <label className="block text-sm font-semibold text-gray-500 mb-1.5">
            {t("usernameLabel")}
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <UserRound className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
            <input
              type="text"
              className="w-full py-3 text-[15px] text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("usernamePlaceholder")}
              autoCapitalize="none"
            />
          </div>

          {/* 비밀번호 입력 */}
          <label className="block text-sm font-semibold text-gray-500 mt-6 mb-1.5">
            {t("passwordLabel")}
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition-all">
            <Lock className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
            <input
              type="password"
              className="w-full py-3 text-[15px] text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              autoCapitalize="none"
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loginPending}
            className="cursor-pointer w-full mt-7 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50 shadow-sm"
          >
            {loginPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              t("loginButton")
            )}
          </button>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              {t("noAccount")}{" "}
              <Link
                href="/signup"
                className="text-blue-600 font-bold hover:underline"
              >
                {t("signup")}
              </Link>
            </p>
          </div>
        </form>
      </div>

      <AppDownloadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
