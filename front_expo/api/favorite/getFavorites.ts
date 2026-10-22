import { FavoriteData } from "@/types/favorite/FavoriteData";
import { client } from "../client";

export const getFavorites = async (): Promise<FavoriteData> => {
  const response = await client.get("/api/users/favorite/");
  return response.data;
};
