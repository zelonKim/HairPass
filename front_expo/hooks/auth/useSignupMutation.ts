import { signupApi } from "@/api/auth/signupApi";
import { setAccessToken } from "@/api/token";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export const useSignupMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signupApi,
    onSuccess: async (data) => {
      if (data.token) {
        await setAccessToken(data.token);
      }
      Alert.alert("회원가입 완료", "HairPass 오신 것을 환영해요 🤗", [
        {
          text: "확인",
          onPress: () => {
            router.replace("/(tabs)");
          },
        },
      ]);
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      let errorMsg = "회원가입 처리 중 오류가 발생했습니다.";

      if (errorData) {
        if (typeof errorData === "string") {
          errorMsg = errorData;
        } else if (errorData.username) {
          errorMsg = `${errorData.username[0]}`;
        } else if (errorData.password) {
          errorMsg = `${errorData.password[0]}`;
        } else if (errorData.password_confirm) {
          errorMsg = `${errorData.password_confirm[0]}`;
        } else if (errorData.non_field_errors) {
          errorMsg = errorData.non_field_errors[0];
        } else if (errorData.error) {
          errorMsg = errorData.error;
        } else {
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            errorMsg = errorData[firstKey][0];
          }
        }
      }

      Alert.alert("회원가입 실패", errorMsg);
    },
  });
};
