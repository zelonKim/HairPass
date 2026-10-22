import { client } from "../client";

export const resetNaverAccount = async () => {
  const response = await client.delete("/api/users/naver-account/");
  return response.data;
};
