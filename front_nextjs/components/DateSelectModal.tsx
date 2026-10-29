"use client";

import React from "react";
import { DateModalProps } from "@/types/booking/DateModalProps";
import { TODAY_STR } from "@/constants/TODAY_STR";
import { useDateSelectModalLanguage } from "@/hooks/languages/useDateSelectModalLanguage";

export default function DateSelectModal({
  visible,
  onClose,
  isCurrentMonth,
  handlePrevMonth,
  handleNextMonth,
  currentYear,
  currentMonth,
  calendarDays,
  bookingDate,
  onSelectDate,
}: DateModalProps) {
  const { t } = useDateSelectModalLanguage();

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
        <div className="flex items-center justify-between mb-4">
          {!isCurrentMonth ? (
            <button
              onClick={handlePrevMonth}
              className="cursor-pointer p-3 flex items-center justify-center text-green-500 font-medium hover:bg-gray-100 rounded-3xl transition-colors"
            >
              ◀
            </button>
          ) : (
            <div className="w-9" />
          )}

          <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
            {t.formatYearMonth(currentYear, currentMonth)}
          </h3>

          <button
            onClick={handleNextMonth}
            className="cursor-pointer p-3 flex items-center justify-center text-green-500 font-medium hover:bg-gray-100 rounded-3xl transition-colors"
          >
            ▶
          </button>
        </div>

        <div className="flex mb-2.5">
          {t.weekDays.map((week, idx) => (
            <span
              key={week}
              className={`flex-1 text-center text-[13px] font-semibold ${
                idx === 0
                  ? "text-red-500"
                  : idx === 6
                    ? "text-green-500"
                    : "text-gray-500"
              }`}
            >
              {week}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap mb-4">
          {calendarDays.map((item, index) => {
            if (!item) {
              return (
                <div
                  key={`empty-${index}`}
                  className="w-[14.28%] h-11 my-0.5"
                />
              );
            }
            const isPast = item.dateString < TODAY_STR;
            const isSelected = bookingDate === item.dateString;

            return (
              <button
                key={item.dateString}
                type="button"
                disabled={isPast}
                onClick={() => onSelectDate(item.dateString)}
                className={`w-[14.28%] h-11 my-0.5 flex items-center justify-center rounded-full text-sm transition-colors ${
                  isSelected
                    ? "bg-green-600 text-white font-bold"
                    : isPast
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-900 hover:bg-gray-100 font-medium cursor-pointer"
                }`}
              >
                {item.dayNum}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer w-full py-3.5 mt-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-sm transition-colors"
        >
          {t.closeBtn}
        </button>
      </div>
    </div>
  );
}
