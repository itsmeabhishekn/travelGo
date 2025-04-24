import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Retrieve the role from localStorage
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && role !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (!adminOnly && role === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
