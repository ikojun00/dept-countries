import axios from "axios";

export const API_URL = "https://bootcamp2025.depster.me";

export const handleApiError = (
  error: unknown,
  defaultMessage: string
): Error => {
  if (axios.isAxiosError(error) && error.response)
    return new Error(error.response.data?.message || defaultMessage);

  return new Error(defaultMessage);
};

export const createAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
});
