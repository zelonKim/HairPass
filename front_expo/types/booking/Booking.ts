export interface Booking {
  id: number;
  salon_name: string;
  booking_date: string;
  booking_time: string;
  designer_name: string;
  menu_name: string;
  payment_method: "NPAY" | "ONSITE" | string;
  status: "PENDING" | "CONFIRMED" | "FAILED" | string;
  naver_booking_id?: string;
  memo?: string;
  created_at: string;
}
