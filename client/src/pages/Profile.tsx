import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from "../services/user.service";
import { fetchBookings } from "../services/booking.service";
import { Booking, User } from "../types/booking.types";

const PLACEHOLDER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<
    "All" | "Upcoming" | "Active" | "Completed"
  >("All");

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const userData: User = await getUserProfile();
        setUser(userData);
        const fetchedBookings: Booking[] = await fetchBookings();
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleProfileUpdate = async (): Promise<void> => {
    if (!user) return;
    try {
      // Update profile data
      const updatedUser: User = await updateUserProfile({
        name: user.name,
        address: user.address,
      });
      setUser(updatedUser);

      // Fetch the updated user profile again
      const refreshedUser: User = await getUserProfile();
      setUser(refreshedUser);

      // Optionally, you can also reload bookings if needed:
      const fetchedBookings: Booking[] = await fetchBookings();
      setBookings(fetchedBookings);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file: File | undefined = e.target.files?.[0];
    if (!file) return;
    try {
      const updatedUser: User = await uploadProfilePicture(file);
      setUser(updatedUser);
    } catch (err) {
      console.error("Failed to upload profile picture", err);
    }
  };

  const handleLogout = (): void => {
    // Remove token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  const filteredBookings = bookings.filter((b: Booking) => {
    const start = new Date(b.packageId.startDate);
    const end = new Date(b.packageId.endDate);
    const now = new Date();
    if (filter === "All") return true;
    if (filter === "Upcoming") return start > now;
    if (filter === "Active") return start <= now && now <= end;
    if (filter === "Completed") return end < now;
    return true;
  });

  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Profile</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center gap-4 mb-6">
          <img
            src={user?.profilePicture || PLACEHOLDER_IMAGE}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={user?.name || ""}
              onChange={(e) =>
                setUser((u) => (u ? { ...u, name: e.target.value } : u))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border p-2 rounded bg-gray-100"
              value={user?.email || ""}
              disabled
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={user?.address || ""}
              onChange={(e) =>
                setUser((u) => (u ? { ...u, address: e.target.value } : u))
              }
            />
          </div>
        </div>
        <button
          onClick={handleProfileUpdate}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Update Profile
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Bookings</h2>
          <select
            className="border p-2 rounded"
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value as "All" | "Upcoming" | "Active" | "Completed"
              )
            }
          >
            <option value="All">All</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        {filteredBookings.length === 0 ? (
          <div className="text-center text-gray-500">No bookings found.</div>
        ) : (
          filteredBookings.map((booking: Booking) => (
            <div
              key={booking._id}
              className="bg-gray-50 p-4 rounded-lg shadow mb-4"
            >
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
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/package/${booking.packageId._id}`)}
                  className="text-blue-500 hover:underline"
                >
                  View Package
                </button>
              </div>
              {booking.selectedServices.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Selected Services:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {booking.selectedServices.map((service: string) => (
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
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
