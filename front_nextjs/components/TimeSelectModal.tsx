"use client";

import React from "react";
import { AM_SLOT } from "@/constants/AM_SLOT";
import { PM_SLOT } from "@/constants/PM_SLOT";
import { TimeModalProps } from "@/types/booking/TimeModalProps";
import { useTimeSelectModalLanguage } from "@/hooks/languages/useTimeSelectModalLanguage";

export default function TimeSelectModal({
  visible,
  onClose,
  bookingTime,
  onSelectTime,
}: TimeModalProps) {
  const { t } = useTimeSelectModalLanguage();

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-5 pb-8 w-full max-w-xl shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-gray-900 text-center mb-4">
          {t("modalTitle")}
        </h3>

        <div className="overflow-y-auto mb-2 pr-1">
          <h4 className="text-sm font-bold text-gray-500 my-3">
            {t("amLabel")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {AM_SLOT.map((timeSlot) => {
              const isSelected = bookingTime === timeSlot;
              return (
                <button
                  key={timeSlot}
                  type="button"
                  onClick={() => onSelectTime(timeSlot)}
                  className={`w-[22.5%] py-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-center mb-1 ${
                    isSelected
                      ? "border-green-600 bg-green-50 text-green-600 font-bold"
                      : "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {timeSlot}
                </button>
              );
            })}
          </div>

          <h4 className="text-sm font-bold text-gray-500 mt-6 mb-3">
            {t("pmLabel")}
          </h4>
          <div className="flex flex-wrap gap-2">
            {PM_SLOT.map((timeSlot) => {
              const isSelected = bookingTime === timeSlot;
              return (
                <button
                  key={timeSlot}
                  type="button"
                  onClick={() => onSelectTime(timeSlot)}
                  className={`w-[22.5%] py-2.5 rounded-lg border text-xs sm:text-sm transition-colors flex items-center justify-center mb-1 ${
                    isSelected
                      ? "border-green-600 bg-green-50 text-green-600 font-bold"
                      : "border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  {timeSlot}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full py-3.5 mt-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-sm transition-colors"
        >
          {t("closeBtn")}
        </button>
      </div>
    </div>
  );
}
