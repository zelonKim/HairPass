"use client";

import React from "react";
import {
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  Scissors,
  Trash2,
} from "lucide-react";
import { useDeleteBooking } from "@/hooks/booking/useDeleteBooking";
import { Booking } from "@/types/booking/Booking";
import { BookingStatusBadge } from "./BookingStatusBadge";
import { useRenderBookingItemLanguage } from "@/hooks/languages/useRenderBookingItemLanguage";

export const RenderBookingItem = ({ item }: { item: Booking }) => {
  const { t, lang } = useRenderBookingItemLanguage();
  const { mutate: BookingDeleteMutation } = useDeleteBooking();

  const confirmAndDelete = (bookingId: number) => {
    const confirmed = window.confirm(t("deleteConfirm"));
    if (confirmed) {
      BookingDeleteMutation(bookingId);
    }
  };

  /////////////////////////////////////////////////////////////////////

  return (
    <div className="bg-white rounded-2xl p-5 mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1 mr-2 min-w-0">
          <MapPin className="w-4 h-4 text-blue-600 mr-1.5 shrink-0" />
          <h3 className="text-base font-bold text-gray-900 truncate mr-3">
            {item.salon_name || t("noSalonInfo")}
          </h3>
          <BookingStatusBadge status={item.status} />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => confirmAndDelete(item.id)}
            className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-100"
            title={t("deleteTitle")}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100 my-3.5" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center text-sm text-gray-600 font-medium">
          <Calendar className="w-4 h-4 text-green-500 mr-2 shrink-0" />
          <span>{item.booking_date}</span>
          <Clock className="w-4 h-4 text-green-500 ml-4 mr-2 shrink-0" />
          <span>
            {item.booking_time ? item.booking_time.substring(0, 5) : ""}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 font-medium">
          <Scissors className="w-4 h-4 text-green-500 mr-2 shrink-0" />
          <span className="truncate">
            {item.designer_name} / {item.menu_name}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-600 font-medium">
          <CreditCard className="w-4 h-4 text-green-500 mr-2 shrink-0" />
          <span>
            {item.payment_method === "NPAY"
              ? t("npayPayment")
              : t("onsitePayment")}
          </span>
        </div>
      </div>
    </div>
  );
};
