import { SignupPayload } from "@/types/auth/SignupPayload";
import { client } from "../client";

export const signupApi = async (data: SignupPayload) => {
  const response = await client.post("/api/users/signup/", data);
  return response.data;
};
