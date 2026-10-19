import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "HAIR_PASS_TOKEN";

export const setAccessToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getAccessToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeAccessToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};
