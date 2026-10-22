import { createBooking } from "@/api/booking/createBooking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data: any) => {
      if (data.status === "need_more_info") {
        Alert.alert("정보 부족", data.message);
        return;
      }
      Alert.alert("예약 신청 완료", "AI 에이전트가 예약을 시작합니다. 🤖", [
        {
          text: "확인",
          onPress: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            router.push("/(tabs)/bookings");
          },
        },
      ]);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "서버와 통신 중 문제가 발생했습니다.";
      Alert.alert("오류 발생", errorMessage);
    },
  });
};
