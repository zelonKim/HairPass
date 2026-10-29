"use client";

import React from "react";
import { Bell, ExternalLink, Sparkles, UserCheck } from "lucide-react";
import { ServiceModalProps } from "@/types/common/ServiceModalProps";
import { useServiceGuideModalLanguage } from "@/hooks/languages/useServiceGuideModalLanguage";

export default function ServiceGuideModal({
  visible,
  onClose,
}: ServiceModalProps) {
  const { t } = useServiceGuideModalLanguage(); 

  if (!visible) return null;

  const guideSteps = [
    {
      step: "01",
      icon: <UserCheck className="w-5 h-5 text-blue-600" />,
      ...t("steps")[0],
    },
    {
      step: "02",
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      ...t("steps")[1],
    },
    {
      step: "03",
      icon: <Bell className="w-5 h-5 text-blue-600" />,
      ...t("steps")[2],
    },
    {
      step: "04",
      icon: <ExternalLink className="w-5 h-5 text-blue-600" />,
      ...t("steps")[3],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 섹션 */}
        <div className="flex flex-col items-center mb-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {t("modalTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {t("modalSubtitle")}
          </p>
        </div>

        {/* 스크롤 가능한 가이드 리스트 */}
        <div className="overflow-y-auto max-h-[60vh] mb-3 pr-1 space-y-3">
          {guideSteps.map((item, index) => (
            <div
              key={index}
              className="flex items-start bg-gray-50 rounded-xl p-3.5 border border-gray-100"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-3 shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <span className="text-xs font-bold text-blue-600 mr-1.5">
                    {item.step}
                  </span>
                  <h3 className="text-sm font-bold text-gray-900 truncate">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 확인 버튼 */}
        <button
          onClick={onClose}
          className="cursor-pointer mt-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
        >
          {t("confirmBtn")}
        </button>
      </div>
    </div>
  );
}
