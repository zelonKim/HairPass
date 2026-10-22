import { NaverAccountData } from "@/types/auth/NaverAccountData";
import { client } from "../client";

export const updateNaverAccount = async (payload: NaverAccountData) => {
  const response = await client.patch(
    "/api/users/naver-account/",
    payload,
  );
  return response.data;
};