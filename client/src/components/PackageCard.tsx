interface PackageCardProps {
  package: TravelPackage;
  onClick: () => void;
}

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

export interface Booking {
  _id: string;
  packageId: string;
  userId: string;
  selectedServices: ServiceType[];
  totalPrice: number;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
}

export interface SearchParams {
  from?: string;
  to?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: "price-asc" | "price-desc";
}

const PackageCard = ({ package: pkg, onClick }: PackageCardProps) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      {pkg.imageUrl && (
        <img
          src={pkg.imageUrl}
          alt={`${pkg.from} to ${pkg.to}`}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">
          {pkg.from} → {pkg.to}
        </h3>
        <p className="text-gray-600 mb-2">
          {new Date(pkg.startDate).toLocaleDateString()} -{" "}
          {new Date(pkg.endDate).toLocaleDateString()}
        </p>
        <p className="text-lg font-bold mb-3">${pkg.basePrice.toFixed(2)}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {pkg.includedServices.map((service) => (
            <span
              key={service}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {service}
            </span>
          ))}
        </div>
        <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">
          View Details
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
