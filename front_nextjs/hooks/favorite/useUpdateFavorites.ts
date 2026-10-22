import { updateFavorites } from "@/api/favorite/updateFavorites";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFavorites,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
      alert("즐겨찾기가 저장되었습니다!");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.detail || "선호 정보 수정에 실패했습니다.";
      alert(errorMsg);
    },
  });
};
