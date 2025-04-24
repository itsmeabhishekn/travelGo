import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/user`
  : "/user";

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const updateUserProfile = async (data: {
  name: string;
  address: string;
}) => {
  const token = localStorage.getItem("token");
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("profilePicture", file);

  const response = await axios.post(`${API_URL}/profile-picture`, formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
