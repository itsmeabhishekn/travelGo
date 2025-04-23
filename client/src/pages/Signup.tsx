// pages/Signup.tsx
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
    const token = await signupWithEmail(email, password);
    if (token) {
      localStorage.setItem("token", token);
      navigate("/");
    }
  };

  const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential;
    if (credential) {
      const reponse: AuthResponse | null = await loginWithGoogle(credential);
      if (response) {
        const token = reponse?.token;
        if (token) {
          localStorage.setItem("token", token);
          navigate("/");
        }
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
