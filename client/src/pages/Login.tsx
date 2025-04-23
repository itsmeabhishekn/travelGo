import { useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../services/auth";
import AuthForm from "../components/AuthForm";
import { CredentialResponse } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    const token = await loginWithEmail(email, password);
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;
    if (credential) {
      const token = await loginWithGoogle(credential);
      if (token) {
        localStorage.setItem("token", token);
        navigate("/dashboard");
      }
    } else {
      console.error("Google login failed: No credential received.");
    }
  };

  return (
    <>
      <AuthForm
        type="login"
        onSubmit={handleLogin}
        onGoogleLoginSuccess={handleGoogleLogin}
      />
    </>
  );
};

export default Login;
