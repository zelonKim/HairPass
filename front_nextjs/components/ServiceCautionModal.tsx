"use client";

import React from "react";
import { AlertTriangle, Ban, CheckCircle2 } from "lucide-react";
import { ServiceModalProps } from "@/types/common/ServiceModalProps";

const cautionItems = [
  {
    title: "실제 예약 확인",
    description:
      "실제 예약 여부는 최종적으로 반드시 네이버 예약 페이지를 통해 확인하여야 하며, 이를 확인하지 않아 생긴 불이익은 본인의 책임입니다.",
    icon: <CheckCircle2 className="w-5 h-5 text-amber-500" />,
  },
  {
    title: "예약 취소 및 변경",
    description:
      "확정된 예약의 취소 및 변경은 네이버 예약 페이지를 통해 직접 진행해 주셔야 합니다.",
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  },
  {
    title: "예약 실패",
    description:
      "이미 예약이 찼거나, 해당 디자이너가 근무하지 않는 날짜 및 시간에 예약을 요청할 경우, 예약에 실패할 수 있습니다.",
    icon: <Ban className="w-5 h-5 text-amber-500" />,
  },
];

/////////////////////////////////////////////////////////////////////

export default function ServiceCautionModal({
  visible,
  onClose,
}: ServiceModalProps) {
  if (!visible) return null;

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
            ⚠️ 서비스 이용 주의사항
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            서비스 이용 전에 아래 내용을 필독해주세요.
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
          확인
        </button>
      </div>
    </div>
  );
}
