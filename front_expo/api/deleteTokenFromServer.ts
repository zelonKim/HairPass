import { client } from "./client";

export const deleteTokenFromServer = async () => {
  try {
    await client.delete("/api/users/push-token/");
  } catch (error) {
    console.log("Push Token 제거 실패:", error);
  }
};
