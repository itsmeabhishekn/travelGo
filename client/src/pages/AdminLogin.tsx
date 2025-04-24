import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/auth";
import AuthForm from "../components/AuthForm";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleAdminLogin = async (email: string, password: string) => {
    const response = await loginAdmin(email, password);
    if (response?.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", "admin");
      navigate("/admin-dashboard");
    }
  };

  return (
    <AuthForm
      type="admin-login"
      onSubmit={handleAdminLogin}
      onGoogleLoginSuccess={() => {}}
      authTitle="Admin Sign In"
    />
  );
};

export default AdminLogin;
