import axios from "axios";
import { API_URL, createAuthHeaders, handleApiError } from "./base";
import type { CountryItem } from "../types";

interface Countries {
  data: CountryItem[];
}

export const fetchRandomCountries = async (
  limit: number,
  token: string
): Promise<CountryItem[]> => {
  try {
    const response = await axios.get<Countries>(`${API_URL}/api/countries`, {
      params: { limit },
      headers: createAuthHeaders(token),
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(
      error,
      "Failed to fetch countries due to an unexpected error."
    );
  }
};
