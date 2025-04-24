import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/user`
  : "/user";

interface UserProfile {
  name: string;
  address: string;
  email: string;
  _id: string;
  profilePicture?: string;
}

interface UpdateProfileData {
  name: string;
  address: string;
}

interface ErrorResponse {
  error: string;
  redirect?: string;
}

export const getUserProfile = async (): Promise<UserProfile> => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get<UserProfile>(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export const updateUserProfile = async (
  data: UpdateProfileData
): Promise<UserProfile> => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put<UserProfile>(`${API_URL}/profile`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export const uploadProfilePicture = async (
  file: File
): Promise<UserProfile> => {
  try {
    const formData = new FormData();
    formData.append("profilePicture", file);

    const res = await axios.post<UserProfile>(
      `${API_URL}/profile-picture`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data;
  } catch (err) {
    const error = err as AxiosError<ErrorResponse>;
    if (error.response?.status === 403 && error.response.data?.redirect) {
      window.location.href = error.response.data.redirect;
    }
    throw error;
  }
};
