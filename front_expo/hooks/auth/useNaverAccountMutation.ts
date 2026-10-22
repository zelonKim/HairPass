import { updateNaverAccount } from "@/api/auth/updateNaverAccount";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useNaverAccountMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateNaverAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["naverAccount"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      Alert.alert("성공", "네이버 계정 정보가 연동되었습니다!", [
        {
          text: "확인",
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          },
        },
      ]);
    },
    onError: (error) => {
      console.error("네이버 계정 저장 실패:", error);
      Alert.alert("오류", "계정 정보 저장 중 문제가 발생했습니다.");
    },
  });
};
