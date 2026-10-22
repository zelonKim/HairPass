import { NaverAccountData } from "@/types/auth/NaverAccountData";
import { client } from "../client";

export const getNaverAccount = async (): Promise<NaverAccountData> => {
  const response = await client.get("/api/users/naver-account/");
  return response.data;
};
