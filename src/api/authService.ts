import axios from "axios";
import { API_URL, handleApiError } from "./base";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    userId: string;
    token: string;
  };
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error, "Login failed. Please check your credentials.");
  }
};
