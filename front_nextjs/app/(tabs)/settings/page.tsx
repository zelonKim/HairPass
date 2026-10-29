"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Link2,
  FileText,
  AlertCircle,
  LogOut,
  UserX,
  ChevronRight,
  Loader2,
  Settings,
} from "lucide-react";

import { removeAccessToken } from "@/api/token";
import { getUserProfile } from "@/api/user/getUserProfile";
import ServiceCautionModal from "@/components/ServiceCautionModal";
import ServiceGuideModal from "@/components/ServiceGuideModal";
import { useResetNaverAccount } from "@/hooks/auth/useResetNaverAccount";
import { useWithdrawAccount } from "@/hooks/auth/useWithdrawAccount";
import { UserProfile } from "@/types/user/UserProfile";
import { useSettingsLanguage } from "@/hooks/languages/useSettingsLanguage";

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { t } = useSettingsLanguage(); // 훅 호출

  const [guideModalVisible, setGuideModalVisible] = useState(false);
  const [cautionModalVisible, setCautionModalVisible] = useState(false);

  /////////////////////////////////////////////////////////////////////

  const { data: userInfo, isLoading } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getUserProfile,
  });

  /////////////////////////////////////////////////////////////////////

  const { mutate: resetNaverAccountMutation } = useResetNaverAccount();

  const handlePressNaverLink = () => {
    if (userInfo?.naver_id && userInfo?.naver_pw) {
      const confirmed = window.confirm(t("confirmNaverReset"));
      if (confirmed) {
        resetNaverAccountMutation();
      }
    } else {
      router.push("/naver-account");
    }
  };

  /////////////////////////////////////////////////////////////////////

  const { mutate: withdrawMutation } = useWithdrawAccount();

  const handleWithdraw = () => {
    const confirmed = window.confirm(t("confirmWithdraw"));
    if (confirmed) {
      withdrawMutation();
    }
  };

  /////////////////////////////////////////////////////////////////////

  const handleLogout = async () => {
    const confirmed = window.confirm(t("confirmLogout"));
    if (confirmed) {
      try {
        await removeAccessToken();
        queryClient.clear();
        router.replace("/login");
      } catch (error) {
        console.error("로그아웃 중 에러 발생:", error);
        window.alert(t("alertLogoutError"));
      }
    }
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <main className="flex-1 w-full min-h-screen bg-blue-50 flex flex-col items-center py-6 px-4">
      <div className="max-w-xl w-full">
        <header className="mb-4">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Settings className="w-6 h-6 text-[#00c05a]" />
            <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">
              {t("headerTitle")}
            </h1>
          </div>
        </header>

        {/* 접속중인 계정 카드 */}
        <div className="flex items-center bg-white rounded-2xl p-5 border border-gray-200 shadow-sm shadow-green-100 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-3.5 shrink-0">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-500 mb-0.5">
              {t("currentAccount")}
            </p>
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin mt-1" />
            ) : (
              <p className="text-base font-bold text-gray-900 truncate">
                {userInfo?.username || t("defaultUser")}
              </p>
            )}
          </div>
        </div>

        {/* 앱 설정 섹션 */}
        <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
          {t("appSettings")}
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={handlePressNaverLink}
            className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <Link2 className="w-5 h-5 text-[#03C75A] mr-3" />
              <span className="text-[15px] font-semibold text-gray-900">
                {t("naverLink")}
              </span>
            </div>
            <span className="text-xs font-medium">
              {userInfo?.naver_id && userInfo?.naver_pw ? (
                <span className="text-emerald-600 font-bold">
                  {t("linked")}
                </span>
              ) : (
                <span className="text-red-500 font-bold">{t("unlinked")}</span>
              )}
            </span>
          </button>
        </div>

        {/* 서비스 안내 섹션 */}
        <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
          {t("serviceGuide")}
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => setGuideModalVisible(true)}
            className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-[15px] font-semibold text-gray-900">
                {t("serviceUsageGuide")}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <div className="h-px bg-gray-100 mx-4" />

          <button
            onClick={() => setCautionModalVisible(true)}
            className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-500 mr-3" />
              <span className="text-[15px] font-semibold text-gray-900">
                {t("serviceCaution")}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* 계정 관리 섹션 */}
        <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
          {t("accountManagement")}
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <LogOut className="w-5 h-5 text-amber-600 mr-3" />
              <span className="text-[15px] font-semibold text-amber-600">
                {t("logout")}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <div className="h-px bg-gray-100 mx-4" />

          <button
            onClick={handleWithdraw}
            className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <UserX className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-[15px] font-semibold text-red-500">
                {t("withdraw")}
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      <ServiceGuideModal
        visible={guideModalVisible}
        onClose={() => setGuideModalVisible(false)}
      />

      <ServiceCautionModal
        visible={cautionModalVisible}
        onClose={() => setCautionModalVisible(false)}
      />
    </main>
  );
}
