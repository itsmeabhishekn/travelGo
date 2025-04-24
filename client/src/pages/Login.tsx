import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../services/auth";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  }, [location, navigate]);

  const handleEmailLogin = async (email: string, password: string) => {
    const res = await loginWithEmail(email, password);
    if (res?.token) {
      localStorage.setItem("token", res.token);
      navigate(res.user.role === "admin" ? "/admin-dashboard" : "/");
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    const res = await loginWithGoogle(credential);
    if (res?.token) {
      localStorage.setItem("token", res.token);
      navigate(res.user.role === "admin" ? "/admin-dashboard" : "/");
    }
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleEmailLogin}
      onGoogleLoginSuccess={handleGoogleCredential}
      authTitle="Sign in to your account"
    />
  );
};

export default Login;
