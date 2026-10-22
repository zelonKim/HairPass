import { createBooking } from "@/api/booking/createBooking";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data: any) => {
      if (data.status === "need_more_info") {
        alert(data.message);
        return;
      }
      alert("AI 에이전트가 예약을 시작합니다. 🤖");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      router.push("/bookings");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "서버와 통신 중 문제가 발생했습니다.";
      alert(errorMessage);
    },
  });
};
