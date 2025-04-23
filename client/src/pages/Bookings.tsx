import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Booking } from "../types/booking.types";
import { fetchBookings } from "../services/booking.service"; // Ensure this is the correct import

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

    loadBookings(); // Correctly calling the function
  }, []);

  if (isLoading)
    return <div className="text-center py-8">Loading your bookings...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 inline-block mr-4">
          Your Bookings
        </h1>
        {/* Go Home button (always visible) */}
        <div className="inline-block text-right mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Home
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-lg mb-4">You have no bookings yet.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Browse Packages
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      Booking #{booking._id.slice(0, 8)}
                    </h3>
                    <p className="text-gray-600">
                      Status:{" "}
                      <span
                        className={`font-medium ${
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
                    <p>Total: ${booking.totalPrice.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      Booked on{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      navigate(`/package/${booking.packageId._id}`)
                    }
                    className="text-blue-500 hover:underline"
                  >
                    View Package
                  </button>
                </div>
                {booking.selectedServices.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium">Selected Services:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {booking.selectedServices.map((service) => (
                        <span
                          key={service}
                          className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
