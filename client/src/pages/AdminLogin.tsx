import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/auth";
import AuthForm from "../components/AuthForm";

const AdminLogin = () => {
  const navigate = useNavigate();

  const handleAdminLogin = async (email: string, password: string) => {
    const token = await loginAdmin(email, password);
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("role", "admin");
      navigate("/admin-dashboard");
    }
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleAdminLogin}
      authTitle="Admin Sign In"
    />
  );
};

export default AdminLogin;
