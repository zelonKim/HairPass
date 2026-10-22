import { client } from "../client";

export const withdrawAccount = async () => {
  const response = await client.delete("/api/users/withdraw/");
  return response.data;
};
