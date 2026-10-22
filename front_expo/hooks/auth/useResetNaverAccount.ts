import { resetNaverAccount } from "@/api/auth/resetNaverAccount";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useResetNaverAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: resetNaverAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      router.push("/(auth)/naver-account");
    },
    onError: (error) => {
      console.error("네이버 연동 해제 실패:", error);
      Alert.alert(
        "오류",
        "기존 네이버 연동 정보를 초기화하는 중 문제가 발생했습니다.",
      );
    },
  });
};
