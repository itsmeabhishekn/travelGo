import axios, { AxiosError } from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/auth`
  : "/auth";

export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
  role: "admin" | "user";
  profilePicture?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

interface ErrorResponse {
  error: string;
  redirect?: string;
}

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(`${API_BASE}/login`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response?.status === 403 && error.response.data?.redirect) {
      window.location.href = error.response.data.redirect;
    }
    throw error;
  }
};

export const signupWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(`${API_BASE}/signup`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response?.status === 403 && error.response.data?.redirect) {
      window.location.href = error.response.data.redirect;
    }
    throw error;
  }
};

export const loginWithGoogle = async (
  credential: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(`${API_BASE}/google`, {
      credential,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response?.status === 403 && error.response.data?.redirect) {
      window.location.href = error.response.data.redirect;
    }
    throw error;
  }
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const res = await axios.post<AuthResponse>(`${API_BASE}/admin/login`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response?.status === 403 && error.response.data?.redirect) {
      window.location.href = error.response.data.redirect;
    }
    throw error;
  }
};
