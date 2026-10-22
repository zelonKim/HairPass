import { client } from "@/api/client";
import { Alert } from "react-native";

export const handleDeleteBooking = (bookingId: number) => {
  Alert.alert("예약 삭제", "해당 예약을 삭제하시겠습니까?", [
    { text: "취소", style: "cancel" },
    {
      text: "확인",
      style: "destructive",
      onPress: async () => {
        try {
          await client.delete(`/api/bookings/${bookingId}/`);
        } catch (error) {
          console.log("예약 삭제 실패:", error);
          Alert.alert("오류", "예약 삭제 중 문제가 발생했습니다.");
        }
      },
    },
  ]);
};
