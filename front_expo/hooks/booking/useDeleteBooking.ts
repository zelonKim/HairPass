import { deleteBooking } from "@/api/booking/deleteBooking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      Alert.alert("성공", "예약이 성공적으로 삭제되었습니다.");
    },
    onError: (error) => {
      console.log("예약 삭제 실패:", error);
      Alert.alert("오류", "예약 삭제 중 문제가 발생했습니다.");
    },
  });
};
