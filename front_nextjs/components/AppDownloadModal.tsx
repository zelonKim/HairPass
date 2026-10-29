"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

import { AndroidDownloadInfo } from "./AndroidDownloadInfo";
import { IosDownloadInfo } from "./IosDownloadInfo";
import { useAppDownloadModalLanguage } from "@/hooks/languages/useAppDownloadModalLanguage";

type TabType = "android" | "ios";

export interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppDownloadModal = ({
  isOpen,
  onClose,
}: AppDownloadModalProps) => {
  const { t } = useAppDownloadModalLanguage(); // 모달 전용 훅 호출
  const [activeTab, setActiveTab] = useState<TabType>("android");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col items-center border transition-all transform scale-100 bg-white border-gray-100 text-gray-900">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 p-1.5 rounded-full border transition-all border-gray-100 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mt-2 mb-4">
          <h3 className="text-xl font-black tracking-tight mb-1">
            {t("modalTitle")}
          </h3>
          <p className="text-[13px] font-medium text-gray-500">
            {t("modalSubtitle")}
          </p>
        </div>

        <div className="w-full flex p-1 rounded-xl mb-5 bg-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab("android")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === "android"
                ? "bg-white text-gray-900 shadow-xs"
                : "cursor-pointer text-gray-400 hover:text-gray-500"
            }`}
          >
            {t("androidTab")}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("ios")}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
              activeTab === "ios"
                ? "bg-white text-gray-900 shadow-xs"
                : "cursor-pointer text-gray-400 hover:text-gray-500"
            }`}
          >
            {t("iosTab")}
          </button>
        </div>

        {activeTab === "android" ? (
          <AndroidDownloadInfo />
        ) : (
          <IosDownloadInfo />
        )}

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm mt-5 transition-all active:scale-[0.99]"
        >
          {t("confirmButton")}
        </button>
      </div>
    </div>
  );
};
