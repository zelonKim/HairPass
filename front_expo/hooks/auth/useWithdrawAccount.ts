import { withdrawAccount } from "@/api/auth/withdrawAccount";
import { removeAccessToken } from "@/api/token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useWithdrawAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: withdrawAccount,
    onSuccess: async () => {
      await removeAccessToken();
      queryClient.clear();
      Alert.alert("회원 탈퇴 완료", "그동안 이용해 주셔서 감사합니다.");
      router.replace("/(auth)/login");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.detail || "회원 탈퇴 처리에 실패했습니다.";
      Alert.alert("오류", errorMsg);
    },
  });
};
