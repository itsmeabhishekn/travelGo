import axios, { AxiosError } from "axios";

const API_BASE_URL = "http://localhost:5000/api/packages";

export interface TravelPackage {
  _id: string;
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  basePrice: number;
  includedServices: string[];
}

export interface PackageFormData {
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  basePrice: string;
  includedServices: string[];
}

export const fetchPackages = async (): Promise<TravelPackage[]> => {
  const response = await axios.get<TravelPackage[]>(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const createPackage = async (
  data: PackageFormData
): Promise<TravelPackage> => {
  const payload = {
    ...data,
    basePrice: Number(data.basePrice),
  };
  const response = await axios.post<TravelPackage>(API_BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};

export const updatePackage = async (
  id: string,
  data: PackageFormData
): Promise<TravelPackage> => {
  const payload = {
    ...data,
    basePrice: Number(data.basePrice),
  };
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
};

export const deletePackage = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
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
