import { updateNaverAccount } from "@/api/auth/updateNaverAccount";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useNaverAccountMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateNaverAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["naverAccount"] });
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      alert("네이버 계정 정보가 연동되었습니다!");
      router.back();
    },
    onError: (error) => {
      console.error("네이버 계정 저장 실패:", error);
      alert("계정 정보 저장 중 문제가 발생했습니다.");
    },
  });
};
