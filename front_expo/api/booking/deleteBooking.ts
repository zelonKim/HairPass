import { client } from "../client";

export const deleteBooking = async (bookingId: number) => {
  const response = await client.delete(`/api/bookings/${bookingId}/`);
  return response.data;
};