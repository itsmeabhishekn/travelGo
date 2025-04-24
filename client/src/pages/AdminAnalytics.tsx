import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUsersAndBookings,
  fetchPackageStatus,
  fetchBookingCountPerPackage,
} from "../services/analyticsService";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion } from "framer-motion";

// Register necessary components for chart types
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface User {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
}

interface Booking {
  _id: string;
  totalPrice: number;
  packageId: {
    from: string;
    to: string;
  };
  selectedServices: string[];
  status: string;
}

interface UserBookingsEntry {
  user: User;
  bookings: Booking[];
}

interface Package {
  _id: string;
  from: string;
  to: string;
}

interface PackageStatus {
  completed: Package[];
  active: Package[];
  upcoming: Package[];
}

interface BookingCountEntry {
  packageId: string;
  packageName: string;
  count: number;
}

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [usersWithBookings, setUsersWithBookings] = useState<
    UserBookingsEntry[]
  >([]);
  const [packageStatus, setPackageStatus] = useState<PackageStatus>({
    completed: [],
    active: [],
    upcoming: [],
  });
  const [bookingCounts, setBookingCounts] = useState<BookingCountEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for managing which user's bookings are collapsed/expanded
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        const [usersBookings, packageStatusData, bookingCountsData] =
          await Promise.all([
            fetchUsersAndBookings(),
            fetchPackageStatus(),
            fetchBookingCountPerPackage(),
          ]);

        // Filter out users with no bookings
        const filteredUsers = usersBookings.filter(
          (entry: UserBookingsEntry) =>
            entry.bookings && entry.bookings.length > 0
        );

        setUsersWithBookings(filteredUsers);
        setPackageStatus(packageStatusData);
        setBookingCounts(bookingCountsData);
      } catch (error) {
        console.error("Error loading analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  // Booking Count Bar Chart Data
  const bookingCountData = {
    labels: bookingCounts.map((entry) => entry.packageName),
    datasets: [
      {
        label: "Booking Count",
        data: bookingCounts.map((entry) => entry.count),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Package Status Pie Chart Data
  const packageStatusData = {
    labels: ["Completed", "Active", "Upcoming"],
    datasets: [
      {
        data: [
          packageStatus.completed.length,
          packageStatus.active.length,
          packageStatus.upcoming.length,
        ],
        backgroundColor: ["#36A2EB", "#FF9F40", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF9F40", "#FF6384"],
      },
    ],
  };

  // Toggle function for expanding/collapsing a user's bookings
  const handleUserClick = (userId: string) => {
    setExpandedUserId((prevId) => (prevId === userId ? null : userId));
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="ml-4 h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse"></div>
            <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8 max-w-6xl mx-auto"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Admin Analytics Dashboard
      </h1>

      {/* Users and Bookings */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100 hover:shadow-lg transition-shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Users and Bookings ({usersWithBookings.length} users with bookings)
        </h2>
        {usersWithBookings.length === 0 ? (
          <p className="text-gray-500">No users with bookings found.</p>
        ) : (
          <div className="space-y-4">
            {usersWithBookings.map((entry) => (
              <motion.div
                key={entry.user._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-b pb-4 last:border-b-0"
              >
                <div
                  className="flex items-start gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                  onClick={() => handleUserClick(entry.user._id)}
                >
                  {entry.user.profilePicture ? (
                    <img
                      src={entry.user.profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                      {entry.user.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">
                      {entry.user.name || "Unknown User"}
                    </h3>
                    <p className="text-sm text-gray-600">{entry.user.email}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {entry.bookings.length} booking(s)
                      </span>
                    </div>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedUserId === entry.user._id ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>

                {/* Show the booking details if the user is expanded */}
                {expandedUserId === entry.user._id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 pl-16"
                  >
                    <h4 className="font-medium mb-2 text-gray-700">
                      Booking Details:
                    </h4>
                    <ul className="space-y-3">
                      {entry.bookings.map((booking) => (
                        <motion.li
                          key={booking._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-50 p-3 rounded-md border border-gray-200 hover:border-indigo-200 transition-colors"
                        >
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-800">
                              {booking.packageId.from} → {booking.packageId.to}
                            </span>
                            <span className="font-bold text-indigo-600">
                              ${booking.totalPrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Status:{" "}
                            <span
                              className={`font-medium ${
                                booking.status === "completed"
                                  ? "text-green-600"
                                  : booking.status === "active"
                                  ? "text-blue-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {booking.status}
                            </span>
                          </div>
                          {booking.selectedServices.length > 0 && (
                            <div className="text-sm mt-2">
                              <span className="text-gray-500">Services: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {booking.selectedServices.map(
                                  (service, idx) => (
                                    <span
                                      key={idx}
                                      className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
                                    >
                                      {service}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Package Status */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100 hover:shadow-lg transition-shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Package Status
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 w-full h-72">
            <Pie
              data={packageStatusData}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.raw} packages`;
                      },
                    },
                  },
                },
              }}
            />
          </div>

          {/* Displaying Package Names Next to the Pie Chart */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-blue-600 mb-3">
                Completed Packages ({packageStatus.completed.length})
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                {packageStatus.completed.length > 0 ? (
                  packageStatus.completed.map((pkg) => (
                    <li key={pkg._id} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {pkg.from} → {pkg.to}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No completed packages</li>
                )}
              </ul>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-orange-500 mb-3">
                Active Packages ({packageStatus.active.length})
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                {packageStatus.active.length > 0 ? (
                  packageStatus.active.map((pkg) => (
                    <li key={pkg._id} className="flex items-center">
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                      {pkg.from} → {pkg.to}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No active packages</li>
                )}
              </ul>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-pink-500 mb-3">
                Upcoming Packages ({packageStatus.upcoming.length})
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                {packageStatus.upcoming.length > 0 ? (
                  packageStatus.upcoming.map((pkg) => (
                    <li key={pkg._id} className="flex items-center">
                      <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                      {pkg.from} → {pkg.to}
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400">No upcoming packages</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Booking Count Bar Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100 hover:shadow-lg transition-shadow"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Booking Count Per Package (Total:{" "}
          {bookingCounts.reduce((sum, item) => sum + item.count, 0)})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 w-full h-72">
            <Bar
              data={bookingCountData}
              options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-4 h-full">
              <h3 className="font-semibold text-gray-700 mb-3">
                Package Booking Counts
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {bookingCounts
                  .sort((a, b) => b.count - a.count)
                  .map((entry) => (
                    <div
                      key={entry.packageId}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
                        {entry.packageName}
                      </span>
                      <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {entry.count}{" "}
                        {entry.count === 1 ? "booking" : "bookings"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminAnalytics;
