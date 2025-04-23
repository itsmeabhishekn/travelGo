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
}

interface Booking {
  _id: string;
  totalPrice: number;
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
  const [usersAndBookings, setUsersAndBookings] = useState<UserBookingsEntry[]>(
    []
  );
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

        setUsersAndBookings(usersBookings);
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
        <h2 className="text-xl font-semibold mb-4">Users and Bookings</h2>
        {usersAndBookings.length === 0 ? (
          <p>No users or bookings found.</p>
        ) : (
          usersAndBookings.map((entry) => (
            <div key={entry.user._id} className="mb-4">
              <h3 className="font-semibold">{entry.user.name || "Unknown"}</h3>
              <p>Email: {entry.user.email}</p>
              <p>Bookings:</p>
              <ul className="list-disc pl-6">
                {entry.bookings.map((booking) => (
                  <li key={booking._id}>
                    Booking #{booking._id.slice(0, 8)} - Total: $
                    {booking.totalPrice.toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Package Status */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Package Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Completed</h3>
            {packageStatus.completed.length === 0 ? (
              <p>No completed packages.</p>
            ) : (
              <ul className="list-disc pl-6">
                {packageStatus.completed.map((pkg) => (
                  <li key={pkg._id}>
                    {pkg.from} → {pkg.to}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Active</h3>
            {packageStatus.active.length === 0 ? (
              <p>No active packages.</p>
            ) : (
              <ul className="list-disc pl-6">
                {packageStatus.active.map((pkg) => (
                  <li key={pkg._id}>
                    {pkg.from} → {pkg.to}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Upcoming</h3>
            {packageStatus.upcoming.length === 0 ? (
              <p>No upcoming packages.</p>
            ) : (
              <ul className="list-disc pl-6">
                {packageStatus.upcoming.map((pkg) => (
                  <li key={pkg._id}>
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
          Booking Count Per Package
        </h2>
        {bookingCounts.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <ul className="list-disc pl-6">
            {bookingCounts.map((entry) => (
              <li key={entry.packageId}>
                {entry.packageName} - {entry.count} bookings
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminAnalytics;
