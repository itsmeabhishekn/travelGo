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
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Logout Button with animation */}
      <div className="mb-8 text-right">
        <button
          onClick={handleLogout}
          className="text-red-600 text-lg font-semibold transition-all hover:text-red-800 transform hover:scale-105 focus:outline-none"
        >
          <span className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7"
              />
            </svg>
            Logout
          </span>
        </button>
      </div>

      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Manage Packages Card */}
        <Link
          to="/admin-packages"
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-indigo-600 mb-4 transition-colors duration-300 hover:text-indigo-800">
            Manage Packages
          </h2>
          <p className="text-gray-600 text-lg">
            Create, edit, and delete travel packages with ease.
          </p>
        </Link>

        {/* Analytics & Reports Card */}
        <Link
          to="/admin-analytics"
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105"
        >
          <h2 className="text-2xl font-semibold text-green-600 mb-4 transition-colors duration-300 hover:text-green-800">
            Analytics & Reports
          </h2>
          <p className="text-gray-600 text-lg">
            View users, bookings, package statuses, and booking counts in
            detail.
          </p>
        </Link>
      </div>

      {/* Hover effect for cards */}
      <style>
        {`
          .transition-shadow {
            transition: box-shadow 0.3s ease-in-out;
          }
          .hover:shadow-2xl:hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
