import { FavoriteData } from "@/types/favorite/FavoriteData";
import { client } from "../client";

export const updateFavorites = async (data: Partial<FavoriteData>) => {
  const response = await client.patch("/api/users/favorite/", data);
  return response.data;
};
