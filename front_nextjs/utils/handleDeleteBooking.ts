import { client } from "@/api/client";

export const handleDeleteBooking = async (
  bookingId: number,
  onSuccess?: () => void,
) => {
  const isConfirmed = window.confirm("해당 예약을 삭제하시겠습니까?");
  if (!isConfirmed) return;

  try {
    await client.delete(`/api/bookings/${bookingId}/`);

    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    console.log("예약 삭제 실패:", error);
    alert("예약 삭제 중 문제가 발생했습니다.");
  }
};
