import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Booking } from "../types/booking.types";
import { fetchBookings } from "../services/booking.service";
import { motion } from "framer-motion";

const Bookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const fetchedBookings = await fetchBookings();
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (isLoading)
    return (
      <div className="text-center py-20 text-lg text-gray-600 animate-pulse">
        Loading your bookings...
      </div>
    );

  return (
    <motion.div
      className="min-h-screen p-6 bg-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Your Bookings</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            Done
          </button>
        </div>

        {bookings.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            <p className="text-xl mb-4 text-gray-700">
              You have no bookings yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Browse Packages
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                className="bg-white p-6 rounded-2xl shadow-md"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Booking #{booking._id.slice(0, 8)}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          booking.status === "Accepted"
                            ? "text-green-500"
                            : booking.status === "Rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </p>
                    <p className="text-gray-700 mt-1">
                      Total: ${booking.totalPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Booked on{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-start">
                    <button
                      onClick={() =>
                        navigate(`/package/${booking.packageId._id}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      View Package →
                    </button>
                  </div>
                </div>

                {booking.selectedServices.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Selected Services:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {booking.selectedServices.map((service) => (
                        <span
                          key={service}
                          className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Bookings;
