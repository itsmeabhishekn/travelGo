import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Link } from "react-router-dom";

const AuthForm = ({
  onSubmit,
  onGoogleLoginSuccess,
  type,
}: {
  onSubmit: (email: string, password: string, confirmPassword?: string) => void;
  onGoogleLoginSuccess?: (response: CredentialResponse) => void;
  type: "login" | "signup";
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (type === "signup" && password !== confirmPassword) return;
    onSubmit(email, password, confirmPassword);
  };

  const handleGoogleLogin = (response: CredentialResponse) => {
    if (onGoogleLoginSuccess) onGoogleLoginSuccess(response);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      {type === "signup" && (
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2"
        />
      )}
      <button
        onClick={handleSubmit}
        className={`${
          type === "signup" ? "bg-green-500" : "bg-blue-500"
        } text-white px-4 py-2`}
      >
        {type === "signup" ? "Signup" : "Login"}
      </button>

      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.log("Google Login Failed")}
      />

      <div className="mt-4 text-sm">
        {type === "signup" ? (
          <Link to="/login" className="text-blue-600 hover:underline">
            Already have an account? Login
          </Link>
        ) : (
          <Link to="/signup" className="text-blue-600 hover:underline">
            Don't have an account? Register
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
