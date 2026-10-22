import React from "react";

interface BookingStatusBadgeProps {
  status: string;
}

export const BookingStatusBadge = ({ status }: BookingStatusBadgeProps) => {
  switch (status) {
    case "CONFIRMED":
      return (
        <div className="px-2.5 py-1 rounded-xl bg-[#E5F7EC] inline-flex items-center justify-center">
          <span className="text-xs font-bold text-emerald-600">예약 확정</span>
        </div>
      );
    case "PENDING":
      return (
        <div className="px-2.5 py-1 rounded-xl bg-[#FEF3C7] inline-flex items-center justify-center">
          <span className="text-xs font-bold text-[#D97706]">예약 대기</span>
        </div>
      );
    case "FAILED":
      return (
        <div className="px-2.5 py-1 rounded-xl bg-[#FEE2E2] inline-flex items-center justify-center">
          <span className="text-xs font-bold text-[#EF4444]">예약 실패</span>
        </div>
      );
    default:
      return (
        <div className="px-2.5 py-1 rounded-xl bg-blue-50 inline-flex items-center justify-center">
          <span className="text-xs font-bold text-blue-600">{status}</span>
        </div>
      );
  }
};
