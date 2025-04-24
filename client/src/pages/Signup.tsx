import { useNavigate } from "react-router-dom";
import {
  signupWithEmail,
  loginWithGoogle,
  AuthResponse,
} from "../services/auth";
import AuthForm from "../components/AuthForm";
import { CredentialResponse } from "@react-oauth/google";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (email: string, password: string) => {
    const response = await signupWithEmail(email, password);
    if (response?.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role);
      navigate("/");
    }
  };

  const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential;
    if (credential) {
      const authResponse: AuthResponse | null = await loginWithGoogle(
        credential
      );
      if (authResponse?.token) {
        localStorage.setItem("token", authResponse.token);
        navigate("/");
      }
    }
  };

  return (
    <AuthForm
      type="signup"
      onSubmit={handleSignup}
      onGoogleLoginSuccess={handleGoogleLoginSuccess}
      authTitle="Create a new account"
    />
  );
};

export default Signup;
