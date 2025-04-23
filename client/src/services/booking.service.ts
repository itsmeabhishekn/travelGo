import axios, { AxiosError } from "axios";
import { ServiceType, Booking } from "../types/booking.types";

const BOOKINGS_API_URL = "http://localhost:5000/api/bookings";

export const bookPackage = async (params: {
  packageId: string;
  selectedServices: ServiceType[];
  totalPrice: number;
}): Promise<void> => {
  await axios.post(BOOKINGS_API_URL, params, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const fetchBookings = async (): Promise<Booking[]> => {
  const response = await axios.get<Booking[]>(BOOKINGS_API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const handleApiError = (error: unknown): string => {
  const err = error as AxiosError<{ message?: string }>;
  return err.response?.data?.message || "An unexpected error occurred";
};
