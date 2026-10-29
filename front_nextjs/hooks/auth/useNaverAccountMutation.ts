import { updateNaverAccount } from "@/api/auth/updateNaverAccount";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const translations = {
  ko: {
    success: "네이버 계정 정보가 연동되었습니다!",
    error: "계정 정보 저장 중 문제가 발생했습니다.",
  },
  en: {
    success: "Naver account has been successfully linked!",
    error: "An error occurred while saving account information.",
  },
};

export const useNaverAccountMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const getTranslation = () => {
    if (typeof window === "undefined") return translations.ko;
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const isKorean = browserLang && browserLang.toLowerCase().startsWith("ko");
    return isKorean ? translations.ko : translations.en;
  };

  return useMutation({
    mutationFn: updateNaverAccount,
    onSuccess: () => {
      const t = getTranslation();
      queryClient.invalidateQueries({ queryKey: ["naverAccount"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      alert(t.success);
      router.back();
    },
    onError: (error) => {
      const t = getTranslation();
      console.error("네이버 계정 저장 실패:", error);
      alert(t.error);
    },
  });
};
