import { updateFavorites } from "@/api/favorite/updateFavorites";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const translations = {
  ko: {
    success: "즐겨찾기가 저장되었습니다!",
    defaultError: "선호 정보 수정에 실패했습니다.",
  },
  en: {
    success: "Favorites saved successfully!",
    defaultError: "Failed to update favorites.",
  },
};

export const useUpdateFavorites = () => {
  const queryClient = useQueryClient();

  const getTranslation = () => {
    if (typeof window === "undefined") return translations.ko;
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const isKorean = browserLang && browserLang.toLowerCase().startsWith("ko");
    return isKorean ? translations.ko : translations.en;
  };

  return useMutation({
    mutationFn: updateFavorites,
    onSuccess: () => {
      const t = getTranslation();
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      alert(t.success);
    },
    onError: (error: any) => {
      const t = getTranslation();
      const errorMsg = error.response?.data?.detail || t.defaultError;
      alert(errorMsg);
    },
  });
};
