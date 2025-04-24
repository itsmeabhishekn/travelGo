import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/analytics`
  : "/analytics";

export const fetchUsersAndBookings = async () => {
  const response = await axios.get(`${API_BASE_URL}/users-bookings`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const fetchPackageStatus = async () => {
  const response = await axios.get(`${API_BASE_URL}/package-status`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const fetchBookingCountPerPackage = async () => {
  const response = await axios.get(`${API_BASE_URL}/booking-count`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};
