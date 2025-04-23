import axios from "axios";

const API_BASE = "http://localhost:5000/api/auth";

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

export const loginWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse | null> => {
  try {
    const res = await axios.post(`${API_BASE}/login`, { email, password });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const signupWithEmail = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const res = await axios.post(`${API_BASE}/signup`, { email, password });
    return res.data.token;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const loginWithGoogle = async (
  credential: string
): Promise<AuthResponse | null> => {
  try {
    const res = await axios.post(`${API_BASE}/google`, { credential });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const loginAdmin = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const res = await axios.post(`${API_BASE}/admin/login`, {
      email,
      password,
    });
    return res.data.token;
  } catch (err) {
    console.error(err);
    return null;
  }
};
