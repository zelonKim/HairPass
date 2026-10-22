import { CreateBookingPayload } from "@/types/booking/CreateBookingPayload";
import { client } from "../client";

export const createBooking = async (data: CreateBookingPayload) => {
  const response = await client.post("/api/bookings/", data);
  return response.data;
};