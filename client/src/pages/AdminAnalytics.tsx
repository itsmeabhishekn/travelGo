import { useEffect, useState } from "react";
import {
  fetchUsersAndBookings,
  fetchPackageStatus,
  fetchBookingCountPerPackage,
} from "../services/analyticsService";

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

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Analytics</h1>

      {/* Users and Bookings */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Users and Bookings ({usersWithBookings.length} users with bookings)
        </h2>
        {usersWithBookings.length === 0 ? (
          <p>No users with bookings found.</p>
        ) : (
          <div className="space-y-6">
            {usersWithBookings.map((entry) => (
              <div
                key={entry.user._id}
                className="border-b pb-4 last:border-b-0"
              >
                <div className="flex items-start gap-4">
                  {entry.user.profilePicture && (
                    <img
                      src={entry.user.profilePicture}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {entry.user.name || "Unknown User"}
                    </h3>
                    <p className="text-sm text-gray-600">{entry.user.email}</p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">
                        {entry.bookings.length}
                      </span>{" "}
                      booking(s)
                    </p>
                  </div>
                </div>

                <div className="mt-3 pl-16">
                  <h4 className="font-medium mb-2">Booking Details:</h4>
                  <ul className="space-y-3">
                    {entry.bookings.map((booking) => (
                      <li
                        key={booking._id}
                        className="bg-gray-50 p-3 rounded-md"
                      >
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {booking.packageId.from} → {booking.packageId.to}
                          </span>
                          <span>${booking.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Status:{" "}
                          <span className="text-green-600">
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-sm mt-1">
                          Services: {booking.selectedServices.join(", ")}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Package Status */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Package Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              Completed ({packageStatus.completed.length})
            </h3>
            {packageStatus.completed.length === 0 ? (
              <p className="text-sm text-gray-500">No completed packages.</p>
            ) : (
              <ul className="space-y-2">
                {packageStatus.completed.map((pkg) => (
                  <li key={pkg._id} className="text-sm">
                    {pkg.from} → {pkg.to}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              Active ({packageStatus.active.length})
            </h3>
            {packageStatus.active.length === 0 ? (
              <p className="text-sm text-gray-500">No active packages.</p>
            ) : (
              <ul className="space-y-2">
                {packageStatus.active.map((pkg) => (
                  <li key={pkg._id} className="text-sm">
                    {pkg.from} → {pkg.to}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">
              Upcoming ({packageStatus.upcoming.length})
            </h3>
            {packageStatus.upcoming.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming packages.</p>
            ) : (
              <ul className="space-y-2">
                {packageStatus.upcoming.map((pkg) => (
                  <li key={pkg._id} className="text-sm">
                    {pkg.from} → {pkg.to}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Booking Count Per Package */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          Booking Count Per Package (Total:{" "}
          {bookingCounts.reduce((sum, item) => sum + item.count, 0)})
        </h2>
        {bookingCounts.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookingCounts.map((entry) => (
              <div key={entry.packageId} className="border p-3 rounded-lg">
                <h3 className="font-medium">{entry.packageName}</h3>
                <p className="text-sm text-gray-600">
                  {entry.count} booking{entry.count !== 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
