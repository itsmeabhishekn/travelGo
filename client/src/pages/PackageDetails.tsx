import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TravelPackage, ServiceType } from "../types/booking.types";
import { fetchPackageById } from "../services/packageService";
import { bookPackage } from "../services/booking.service";

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pkg, setPackage] = useState<TravelPackage | null>(null);
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const loadPackage = async () => {
      try {
        if (id) {
          const data = await fetchPackageById(id);
          setPackage(data);
          setSelectedServices(data.includedServices);
        }
      } catch (error) {
        console.error("Failed to fetch package:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPackage();
  }, [id]);

  const toggleService = (service: ServiceType) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  // Adjusting total price calculation to reflect selected services
  const calculateTotalPrice = () => {
    if (!pkg) return 0;

    // Start with the base price
    let totalPrice = pkg.basePrice;

    // Add 500 for each selected service
    const serviceCost = 500;
    selectedServices.forEach(() => {
      totalPrice += serviceCost;
    });

    return totalPrice;
  };

  const handleBook = async () => {
    if (!id) return;
    setIsBooking(true);
    try {
      await bookPackage({
        packageId: id,
        selectedServices,
        totalPrice: calculateTotalPrice(),
      });
      navigate("/bookings");
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading)
    return <div className="text-center py-8">Loading package details...</div>;
  if (!pkg) return <div className="text-center py-8">Package not found</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-500 hover:underline"
        >
          ← Back to search
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {pkg.imageUrl && (
            <img
              src={pkg.imageUrl}
              alt={`${pkg.from} to ${pkg.to}`}
              className="w-full h-64 object-cover"
            />
          )}

          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">
              {pkg.from} → {pkg.to}
            </h1>
            <p className="text-gray-600 mb-4">
              {new Date(pkg.startDate).toLocaleDateString()} -{" "}
              {new Date(pkg.endDate).toLocaleDateString()}
            </p>

            <p className="mb-6">{pkg.description}</p>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Included Services</h2>
              <div className="space-y-2">
                {(
                  [
                    "Food",
                    "Accommodation",
                    "Transportation",
                    "Guided Tours",
                  ] as ServiceType[]
                ).map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service)}
                      onChange={() => toggleService(service)}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg">Total Price:</p>
                  <p className="text-2xl font-bold">
                    ${calculateTotalPrice().toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={handleBook}
                  disabled={isBooking}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 disabled:bg-green-300"
                >
                  {isBooking ? "Booking..." : "Book Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;
