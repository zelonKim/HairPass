"use client";

import React from "react";
import { AlertTriangle, Ban, CheckCircle2 } from "lucide-react";
import { ServiceModalProps } from "@/types/common/ServiceModalProps";
import { useServiceCautionModalLanguage } from "@/hooks/languages/useServiceCautionModalLanguage";

export default function ServiceCautionModal({
  visible,
  onClose,
}: ServiceModalProps) {
  const { t } = useServiceCautionModalLanguage();

  if (!visible) return null;

  // 아이콘은 고정하고 텍스트만 다국어 배열에서 매핑
  const cautionItems = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-amber-500" />,
      ...t("cautions")[0],
    },
    {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      ...t("cautions")[1],
    },
    {
      icon: <Ban className="w-5 h-5 text-amber-500" />,
      ...t("cautions")[2],
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
        <div className="flex flex-col items-center mb-5 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {t("modalTitle")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            {t("modalSubtitle")}
          </p>
        </div>

        <div className="overflow-y-auto max-h-[60vh] mb-3 pr-1 space-y-3">
          {cautionItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start bg-amber-50/60 rounded-xl p-3.5 border border-amber-100"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center mr-3 shrink-0">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="cursor-pointer mt-3 w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
        >
          {t("confirmBtn")}
        </button>
      </div>
    </div>
  );
}
