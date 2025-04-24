import axios, { AxiosError } from "axios";
import { ServiceType, Booking } from "../types/booking.types";

const BOOKINGS_API_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/bookings`
  : "/bookings";

interface ApiError {
  message?: string;
  redirect?: string;
}

export const bookPackage = async (params: {
  packageId: string;
  selectedServices: ServiceType[];
  totalPrice: number;
}): Promise<void> => {
  try {
    await axios.post(BOOKINGS_API_URL, params, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response?.status === 403 && error.response.data?.redirect) {
      window.location.href = error.response.data.redirect;
    }
    throw error;
  }
};

export const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const response = await axios.get<Booking[]>(BOOKINGS_API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    if (error.response?.status === 403 && error.response.data?.redirect) {
      window.location.href = error.response.data.redirect;
    }
    throw error;
  }
};

export const handleApiError = (error: unknown): string => {
  const err = error as AxiosError<{ message?: string }>;
  return err.response?.data?.message || "An unexpected error occurred";
};
