"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, ExternalLink, Loader2, RotateCw } from "lucide-react";
import { getBookings } from "@/api/booking/getBookings";
import { RenderBookingItem } from "@/components/RenderBookingItem";
import { Booking } from "@/types/booking/Booking";
import { handleOpenNaverBooking } from "@/utils/handleOpenNaverBooking";

export default function BookingsScreen() {
  const {
    data: bookings = [],
    isPending,
    isError,
    refetch,
    isRefetching,
  } = useQuery<Booking[]>({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  /////////////////////////////////////////////////////////////////////

  return (
    <div className="flex-1 w-full min-h-screen bg-blue-50 flex flex-col py-6 ">
      <header className="flex items-center justify-between px-5  bg-blue-50 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <CalendarDays className="w-6 h-6 text-[#00c05a]" />
          <h1 className="text-[21px] font-bold text-gray-900">
            나의 예약 내역
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="cursor-pointer p-2 text-gray-500 hover:text-gray-700 rounded-xl hover:bg-blue-100 transition-colors"
            title="새로고침"
          >
            <RotateCw
              className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
            />
          </button>

          <button
            onClick={handleOpenNaverBooking}
            className="cursor-pointer flex items-center gap-1 px-2.5 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
          >
            <span>네이버 예약</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#03C75A]" />
          </button>
        </div>
      </header>

      <main className="flex-1 p-5 pb-24">
        {isPending ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-gray-500">예약 내역을 불러오는 중...</p>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
            <p className="text-sm text-gray-500">
              예약 목록을 가져올 수 없습니다.
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <h2 className="text-base font-bold text-gray-900 mb-1.5">
              아직 예약된 내역이 없습니다.
            </h2>
            <p className="text-xs text-gray-500">
              홈에서 원하는 미용실을 바로 예약해보세요!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {bookings.map((item) => (
              <RenderBookingItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
