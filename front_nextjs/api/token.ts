const TOKEN_KEY = "HAIR_PASS_TOKEN";

export const setAccessToken = async (token: string): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const removeAccessToken = async (): Promise<void> => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
};
