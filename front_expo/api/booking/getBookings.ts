import { Booking } from "@/types/booking/Booking";
import { client } from "../client";

export const getBookings = async (): Promise<Booking[]> => {
  const response = await client.get("/api/bookings/");
  return response.data;
};