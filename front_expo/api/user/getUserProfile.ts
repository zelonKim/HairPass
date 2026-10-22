import { UserProfile } from "@/types/user/UserProfile";
import { client } from "../client";

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await client.get("/api/users/");
  return response.data;
};
