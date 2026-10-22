import { withdrawAccount } from "@/api/auth/withdrawAccount";
import { removeAccessToken } from "@/api/token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useWithdrawAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: withdrawAccount,
    onSuccess: async () => {
      await removeAccessToken();
      queryClient.clear();
      alert("그동안 이용해 주셔서 감사합니다.");
      router.replace("/login");
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.detail || "회원 탈퇴 처리에 실패했습니다.";
      alert(errorMsg);
    },
  });
};
