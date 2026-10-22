import { LoginPayload } from "@/types/auth/LoginPayload";
import { client } from "../client";

export const loginApi = async (data: LoginPayload) => {
  const response = await client.post("/api/users/login/", data);
  return response.data;
};