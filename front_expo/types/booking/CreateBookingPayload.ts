export interface CreateBookingPayload {
  salon_name: string;
  designer_name: string;
  menu_name: string;
  booking_date: string;
  booking_time: string;
  payment_method: "NPAY" | "ONSITE";
}
