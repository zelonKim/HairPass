"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Store, Calendar, Clock, Loader2 } from "lucide-react";

import { getFavorites } from "@/api/favorite/getFavorites";
import { getUserProfile } from "@/api/user/getUserProfile";
import { useCreateBooking } from "@/hooks/booking/useCreateBooking";
import { FavoriteData } from "@/types/favorite/FavoriteData";
import { UserProfile } from "@/types/user/UserProfile";
import DateSelectModal from "@/components/DateSelectModal";
import { THIS_YEAR } from "@/constants/THIS_YEAR";
import { THIS_MONTH } from "@/constants/THIS_MONTH";
import { getDaysInMonth } from "@/utils/getDaysInMonth";
import TimeSelectModal from "@/components/TimeSelectModal";
import { useHomeLanguage } from "@/hooks/languages/useHomeLanguage";

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useHomeLanguage(); // 훅 호출

  const [salonName, setSalonName] = useState("");
  const [designerName, setDesignerName] = useState("");
  const [menuName, setMenuName] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"NPAY" | "ONSITE">("NPAY");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(THIS_YEAR);
  const [currentMonth, setCurrentMonth] = useState(THIS_MONTH);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  const calendarDays = getDaysInMonth(currentYear, currentMonth);
  const isCurrentMonth =
    currentYear === THIS_YEAR && currentMonth === THIS_MONTH;

  const handlePrevMonth = () => {
    if (isCurrentMonth) return;
    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    const maxYear = THIS_YEAR + 1;
    if (currentYear >= maxYear && currentMonth >= THIS_MONTH) return;
    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  /////////////////////////////////////////////////////////////////////

  const { data: favData } = useQuery<FavoriteData>({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  useEffect(() => {
    if (favData) {
      setSalonName(favData.favorite_salon || "");
      setDesignerName(favData.favorite_designer || "");
      setMenuName(favData.favorite_menu || "");
    }
  }, [favData]);

  /////////////////////////////////////////////////////////////////////

  const { data: userInfo } = useQuery<UserProfile>({
    queryKey: ["userInfo"],
    queryFn: getUserProfile,
  });

  /////////////////////////////////////////////////////////////////////

  const { mutate: createBookingMutation, isPending: createBookingPending } =
    useCreateBooking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !salonName ||
      !designerName ||
      !menuName ||
      !bookingDate ||
      !bookingTime
    ) {
      alert(t("alertIncomplete"));
      return;
    }

    if (!userInfo?.naver_id || !userInfo?.naver_pw) {
      const confirmed = window.confirm(t("confirmNaverLink"));
      if (confirmed) {
        router.push("/naver-account");
      }
      return;
    }

    createBookingMutation({
      salon_name: salonName,
      designer_name: designerName,
      menu_name: menuName,
      booking_date: bookingDate,
      booking_time: bookingTime,
      payment_method: paymentMethod,
    });
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <main className="min-h-screen bg-blue-50 flex flex-col items-center py-6 px-4">
      <div className="max-w-xl w-full pb-10">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Store className="w-6 h-6 text-[#00c05a]" />
            <h1 className="text-[21px] font-bold text-gray-900">
              {t("headerTitle")}
            </h1>
          </div>
          <p className="text-sm text-gray-500">{t("headerSubtitle")}</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          {/* 미용실 이름 */}
          <label className="block text-[13px] font-semibold text-gray-600 mt-2 mb-1.5">
            {t("salonNameLabel")}
          </label>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-green-400 placeholder:text-gray-400"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
            placeholder={t("salonNamePlaceholder")}
          />

          {/* 담당 디자이너 */}
          <label className="block text-[13px] font-semibold text-gray-600 mt-4 mb-1.5">
            {t("designerNameLabel")}
          </label>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-green-400 placeholder:text-gray-400"
            value={designerName}
            onChange={(e) => setDesignerName(e.target.value)}
            placeholder={t("designerNamePlaceholder")}
          />

          {/* 시술 메뉴 */}
          <label className="block text-[13px] font-semibold text-gray-600 mt-4 mb-1.5">
            {t("menuNameLabel")}
          </label>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-green-400 placeholder:text-gray-400"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            placeholder={t("menuNamePlaceholder")}
          />

          {/* 예약 날짜 */}
          <label className="block text-[13px] font-semibold text-gray-600 mt-4 mb-1.5">
            {t("bookingDateLabel")}
          </label>
          <div
            onClick={() => setIsDateModalOpen(true)}
            className="relative flex items-center w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Calendar className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
            <span
              className={`text-[15px] font-medium ${bookingDate ? "text-gray-900" : "text-gray-400"}`}
            >
              {bookingDate || t("bookingDatePlaceholder")}
            </span>
          </div>

          {/* 예약 시간 */}
          <label className="block text-[13px] font-semibold text-gray-600 mt-4 mb-1.5">
            {t("bookingTimeLabel")}
          </label>
          <div
            onClick={() => setIsTimeModalOpen(true)}
            className="relative flex items-center w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <Clock className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
            <span
              className={`text-[15px] font-medium ${bookingTime ? "text-gray-900" : "text-gray-400"}`}
            >
              {bookingTime || t("bookingTimePlaceholder")}
            </span>
          </div>

          {/* 결제 수단 */}
          <label className="block text-[13px] font-semibold text-gray-600 mt-4 mb-1.5">
            {t("paymentMethodLabel")}
          </label>
          <div className="grid grid-cols-2 gap-3 mt-1 mb-6">
            <button
              type="button"
              className={`cursor-pointer py-3.5 rounded-xl border text-center text-[15px] font-medium transition-colors ${
                paymentMethod === "NPAY"
                  ? "border-green-500 bg-green-50 text-green-600 font-bold"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setPaymentMethod("NPAY")}
            >
              {t("npay")}
            </button>

            <button
              type="button"
              className={`cursor-pointer py-3.5 rounded-xl border text-center text-[15px] font-medium transition-colors ${
                paymentMethod === "ONSITE"
                  ? "border-green-500 bg-green-50 text-green-600 font-bold"
                  : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
              }`}
              onClick={() => setPaymentMethod("ONSITE")}
            >
              {t("onsite")}
            </button>
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={createBookingPending}
            className="cursor-pointer w-full bg-[#00c05a] hover:bg-green-600 active:bg-green-600 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {createBookingPending ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              t("submitButton")
            )}
          </button>
        </form>
      </div>

      <DateSelectModal
        visible={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        isCurrentMonth={isCurrentMonth}
        handlePrevMonth={handlePrevMonth}
        handleNextMonth={handleNextMonth}
        currentYear={currentYear}
        currentMonth={currentMonth}
        calendarDays={calendarDays}
        bookingDate={bookingDate}
        onSelectDate={(date) => {
          setBookingDate(date);
          setIsDateModalOpen(false);
        }}
      />

      <TimeSelectModal
        visible={isTimeModalOpen}
        onClose={() => setIsTimeModalOpen(false)}
        bookingTime={bookingTime}
        onSelectTime={(time) => {
          setBookingTime(time);
          setIsTimeModalOpen(false);
        }}
      />
    </main>
  );
}
