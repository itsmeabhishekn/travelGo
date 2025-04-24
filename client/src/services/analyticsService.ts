import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/analytics`
  : "/analytics";

interface ErrorResponse {
  error: string;
  redirect?: string;
}

export const fetchUsersAndBookings = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/users-bookings`, {
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

export const fetchPackageStatus = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/package-status`, {
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

export const fetchBookingCountPerPackage = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE_URL}/booking-count`, {
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
