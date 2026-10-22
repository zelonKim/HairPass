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
} from "lucide-react";

import { removeAccessToken } from "@/api/token";
import { getUserProfile } from "@/api/user/getUserProfile";
import ServiceCautionModal from "@/components/ServiceCautionModal";
import ServiceGuideModal from "@/components/ServiceGuideModal";
import { useResetNaverAccount } from "@/hooks/auth/useResetNaverAccount";
import { useWithdrawAccount } from "@/hooks/auth/useWithdrawAccount";
import { UserProfile } from "@/types/user/UserProfile";

export default function SettingsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

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
      const confirmed = window.confirm(
        "이미 연동된 네이버 계정이 있습니다. 새로운 계정을 연동하시겠습니까?",
      );
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
    const confirmed = window.confirm(
      "⚠️ 회원 탈퇴\n탈퇴 시 모든 정보가 삭제되며 이를 복구할 수 없습니다. 정말 탈퇴하시겠습니까?",
    );
    if (confirmed) {
      withdrawMutation();
    }
  };

  /////////////////////////////////////////////////////////////////////

  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃\n정말 로그아웃 하시겠습니까?");
    if (confirmed) {
      try {
        await removeAccessToken();
        queryClient.clear();
        router.replace("/login");
      } catch (error) {
        console.error("로그아웃 중 에러 발생:", error);
        window.alert("로그아웃 처리 중 문제가 발생했습니다.");
      }
    }
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <main className="flex-1 w-full min-h-screen bg-blue-50 flex flex-col items-center py-6 px-4 pb-28">
      <div className="max-w-xl w-full">
        <header className="mb-4">
          <h1 className="text-[21px] font-bold text-gray-900 tracking-tight">
            나의 설정
          </h1>
        </header>

        <div className="flex items-center bg-white rounded-2xl p-5 border border-gray-200 shadow-sm shadow-green-100 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mr-3.5 shrink-0">
            <User className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-500 mb-0.5">
              접속중인 계정
            </p>
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin mt-1" />
            ) : (
              <p className="text-base font-bold text-gray-900 truncate">
                {userInfo?.username || "사용자"}
              </p>
            )}
          </div>
        </div>

        <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
          앱 설정
        </h2>
        <div className=" bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={handlePressNaverLink}
            className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <Link2 className="w-5 h-5 text-[#03C75A] mr-3" />
              <span className="text-[15px] font-semibold text-gray-900">
                네이버 계정 연동하기
              </span>
            </div>
            <span className="text-xs font-medium">
              {userInfo?.naver_id && userInfo?.naver_pw ? (
                <span className="text-emerald-600 font-bold">연동 완료</span>
              ) : (
                <span className="text-red-500 font-bold">미연동</span>
              )}
            </span>
          </button>
        </div>

        <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
          서비스 안내
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={() => setGuideModalVisible(true)}
            className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-[15px] font-semibold text-gray-900">
                서비스 이용 방법
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
                서비스 이용 주의사항
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <h2 className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">
          계정 관리
        </h2>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
          <button
            onClick={handleLogout}
            className="cursor-pointer w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center">
              <LogOut className="w-5 h-5 text-amber-600 mr-3" />
              <span className="text-[15px] font-semibold text-amber-600">
                로그아웃
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
                회원 탈퇴
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
