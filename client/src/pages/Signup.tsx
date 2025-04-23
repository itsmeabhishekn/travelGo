import { useNavigate } from "react-router-dom";
import { signupWithEmail, loginWithGoogle } from "../services/auth";
import AuthForm from "../components/AuthForm";
import { CredentialResponse } from "@react-oauth/google";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (email: string, password: string) => {
    const token = await signupWithEmail(email, password);
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    }
  };

  const handleGoogleLoginSuccess = async (response: CredentialResponse) => {
    const credential = response.credential;
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
    <AuthForm
      type="signup"
      onSubmit={handleSignup}
      onGoogleLoginSuccess={handleGoogleLoginSuccess}
    />
  );
};

export default Signup;
