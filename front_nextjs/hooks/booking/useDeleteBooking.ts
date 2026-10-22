import { deleteBooking } from "@/api/booking/deleteBooking";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      alert("예약이 성공적으로 삭제되었습니다.");
    },
    onError: (error) => {
      console.log("예약 삭제 실패:", error);
      alert("예약 삭제 중 문제가 발생했습니다.");
    },
  });
};
