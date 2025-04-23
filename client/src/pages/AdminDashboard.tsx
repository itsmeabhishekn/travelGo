import { Link, useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Handle logout functionality
  const handleLogout = () => {
    // Clear the authentication token or session
    localStorage.removeItem("authToken"); // or cookie removal if used

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div className="p-8">
      {/* Logout Button */}
      <div className="mb-4 text-right">
        <button
          onClick={handleLogout}
          className="text-red-600 btn hover:text-red-800 mb-6"
        >
          Logout
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin-packages"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Packages</h2>
          <p className="text-gray-600">
            Create, edit, and delete travel packages
          </p>
        </Link>
        <Link
          to="/admin-analytics"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Analytics & Reports</h2>
          <p className="text-gray-600">
            View users, bookings, package statuses, and booking counts
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
