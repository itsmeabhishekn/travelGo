// src/types.ts
export interface TravelPackage {
  _id: string;
  from: string;
  to: string;
  startDate: string;
  endDate: string;
  basePrice: number;
  includedServices: ServiceType[];
  description?: string;
  imageUrl?: string;
}

export type ServiceType =
  | "Food"
  | "Accommodation"
  | "Transportation"
  | "Guided Tours";

export type SortBy = "price-asc" | "price-desc" | "";

export interface Booking {
  _id: string;
  packageId: TravelPackage;
  userId: string;
  selectedServices: ServiceType[];
  totalPrice: number;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
}

export type SearchParams = {
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: SortBy;
};
