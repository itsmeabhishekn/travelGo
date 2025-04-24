import axios, { AxiosError } from "axios";
import { TravelPackage } from "../types/booking.types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/packages`
  : "/packages";

interface ApiError {
  message?: string;
  redirect?: string;
}

export interface PackageFormData {
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  basePrice: string;
  includedServices: string[];
}

const handle403 = (err: AxiosError<ApiError>) => {
  if (err.response?.status === 403 && err.response.data?.redirect) {
    window.location.href = err.response.data.redirect;
  }
};

export const fetchPackages = async (): Promise<TravelPackage[]> => {
  try {
    const response = await axios.get<TravelPackage[]>(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    handle403(error);
    throw error;
  }
};

export const createPackage = async (
  data: PackageFormData
): Promise<TravelPackage> => {
  try {
    const payload = { ...data, basePrice: Number(data.basePrice) };
    const response = await axios.post<TravelPackage>(API_BASE_URL, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    handle403(error);
    throw error;
  }
};

export const updatePackage = async (
  id: string,
  data: PackageFormData
): Promise<TravelPackage> => {
  try {
    const payload = { ...data, basePrice: Number(data.basePrice) };
    const response = await axios.put<TravelPackage>(
      `${API_BASE_URL}/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    handle403(error);
    throw error;
  }
};

export const deletePackage = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    handle403(error);
    throw error;
  }
};

export const fetchPackageById = async (id: string): Promise<TravelPackage> => {
  try {
    const response = await axios.get<TravelPackage>(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiError>;
    handle403(error);
    throw error;
  }
};

export const handleApiError = (error: unknown): string => {
  const err = error as AxiosError<{ message?: string }>;
  return err.response?.data?.message || "An unexpected error occurred";
};

export const serviceOptions = [
  "Food",
  "Accommodation",
  "Transportation",
  "Guided Tours",
] as const;
