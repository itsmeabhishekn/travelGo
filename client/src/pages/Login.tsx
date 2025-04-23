import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../services/auth";
import AuthForm from "../components/AuthForm";
import { CredentialResponse } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const res = await loginWithEmail(email, password);
    if (res?.token) {
      localStorage.setItem("token", res.token);
      const role = res.user?.role;
      navigate(role === "admin" ? "/admin-dashboard" : "/");
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;
    if (credential) {
      const res = await loginWithGoogle(credential);
      if (res?.token) {
        localStorage.setItem("token", res.token);
        navigate(res.user?.role === "admin" ? "/admin-dashboard" : "/");
      }
    }
  };

  return (
    <AuthForm
      type="login"
      onSubmit={handleLogin}
      onGoogleLoginSuccess={handleGoogleLogin}
      authTitle="Sign in to your account"
    />
  );
};

export default Login;
