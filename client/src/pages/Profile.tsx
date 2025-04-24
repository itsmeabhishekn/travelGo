import { useEffect, useState, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from "../services/user.service";
import { fetchBookings } from "../services/booking.service";
import { Booking } from "../types/booking.types";
import { motion } from "framer-motion";

const PLACEHOLDER_IMAGE =
  "https://cdn-icons-png.flaticon.com/512/847/847969.png";

interface UserProfile {
  name: string;
  address: string;
  email: string;
  _id: string;
  profilePicture?: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<
    "All" | "Upcoming" | "Active" | "Completed"
  >("All");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        const fetchedBookings = await fetchBookings();
        setBookings(fetchedBookings);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleProfileUpdate = async () => {
    if (!user) return;
    try {
      const updatedUser = await updateUserProfile({
        name: user.name,
        address: user.address,
      });
      setUser(updatedUser);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile.");
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const updatedUser = await uploadProfilePicture(file);
      setUser(updatedUser);
      const refreshedUser = await getUserProfile();
      setUser(refreshedUser);
      alert("Profile picture updated successfully!");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Failed to upload profile picture", err);
      alert("Failed to upload profile picture.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredBookings = bookings.filter((b) => {
    const start = new Date(b.packageId.startDate);
    const end = new Date(b.packageId.endDate);
    const now = new Date();
    if (filter === "All") return true;
    if (filter === "Upcoming") return start > now;
    if (filter === "Active") return start <= now && now <= end;
    if (filter === "Completed") return end < now;
    return true;
  });

  if (isLoading)
    return (
      <div className="text-center py-12 text-lg animate-pulse">
        Loading your profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 sm:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Your Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            Logout
          </button>
        </div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg mb-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={user?.profilePicture || PLACEHOLDER_IMAGE}
              alt="avatar"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-100"
            />
            <div className="flex flex-col gap-3">
              <label className="relative inline-block">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer">
                  {isUploading ? "Uploading..." : "Change Picture"}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>
              <span className="text-xs text-gray-500">
                Max 5MB, JPG/PNG/GIF
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                value={user?.name || ""}
                onChange={(e) =>
                  setUser((u) => (u ? { ...u, name: e.target.value } : u))
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">
                Address
              </label>
              <input
                type="text"
                value={user?.address || ""}
                onChange={(e) =>
                  setUser((u) => (u ? { ...u, address: e.target.value } : u))
                }
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
          <button
            onClick={handleProfileUpdate}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 shadow-md transition"
          >
            Save Changes
          </button>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Bookings</h2>
            <select
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
            <div className="text-center text-gray-500 py-8">
              No bookings found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking._id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border hover:shadow-md transition"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        Booking #{booking._id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Status:{" "}
                        <span
                          className={`font-medium ${
                            booking.status === "Accepted"
                              ? "text-green-600"
                              : booking.status === "Rejected"
                              ? "text-red-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </p>
                      <p className="text-sm">
                        Total: ${booking.totalPrice.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        navigate(`/package/${booking.packageId._id}`)
                      }
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View Package
                    </button>
                  </div>
                  {booking.selectedServices.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">
                        Selected Services:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {booking.selectedServices.map((service) => (
                          <span
                            key={service}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-lg"
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
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
