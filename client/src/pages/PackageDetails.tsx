import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TravelPackage, ServiceType } from "../types/booking.types";
import { fetchPackageById } from "../services/packageService";
import { bookPackage } from "../services/booking.service";
import { motion } from "framer-motion";

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

  const calculateTotalPrice = () => {
    if (!pkg) return 0;
    return pkg.basePrice + selectedServices.length * 500;
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
    return (
      <div className="text-center py-20 text-lg">
        Loading package details...
      </div>
    );
  if (!pkg)
    return <div className="text-center py-20 text-lg">Package not found</div>;

  return (
    <motion.div
      className="min-h-screen p-6 bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline mb-6"
        >
          ← Back to search
        </button>

        <motion.div
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {pkg.imageUrl && (
            <img
              src={pkg.imageUrl}
              alt={`${pkg.from} to ${pkg.to}`}
              className="w-full h-[320px] object-cover"
            />
          )}

          <div className="p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {pkg.from} → {pkg.to}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {new Date(pkg.startDate).toLocaleDateString()} -{" "}
                {new Date(pkg.endDate).toLocaleDateString()}
              </p>
            </div>

            <p className="text-gray-800 text-md">{pkg.description}</p>

            <div>
              <h2 className="text-xl font-semibold mb-3">Customize Services</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(
                  [
                    "Food",
                    "Accommodation",
                    "Transportation",
                    "Guided Tours",
                  ] as ServiceType[]
                ).map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-lg p-3 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service)}
                      onChange={() => toggleService(service)}
                      className="accent-blue-600"
                    />
                    <span className="text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t flex justify-between items-center">
              <div>
                <p className="text-lg font-medium text-gray-800">Total Price</p>
                <p className="text-2xl font-bold text-green-600">
                  ${calculateTotalPrice().toFixed(2)}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleBook}
                disabled={isBooking}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {isBooking ? "Booking..." : "Book Now"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PackageDetails;
