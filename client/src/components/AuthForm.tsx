import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import AuthLayout from "./AuthLayout";

interface AuthFormProps {
  onSubmit: (email: string, password: string, confirmPassword?: string) => void;
  onGoogleLoginSuccess: (credential: string) => void;
  type: "login" | "signup";
  authTitle: string;
}

const AuthForm = ({
  onSubmit,
  onGoogleLoginSuccess,
  type,
  authTitle,
}: AuthFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (type === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    onSubmit(email, password, type === "signup" ? confirmPassword : undefined);
  };

  const handleGoogleLogin = (response: CredentialResponse) => {
    if (response.credential) {
      onGoogleLoginSuccess(response.credential);
    } else {
      console.error("No Google credential found");
    }
  };

  return (
    <AuthLayout
      title={authTitle}
      footerText={
        type === "signup"
          ? "Already have an account?"
          : "Don't have an account?"
      }
      footerLink={type === "signup" ? "/login" : "/signup"}
      footerLinkText={type === "signup" ? "Login" : "Register"}
    >
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete={
              type === "signup" ? "new-password" : "current-password"
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {type === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {type === "signup" ? "Sign up" : "Sign in"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google login failed")}
            useOneTap={type === "login"}
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default AuthForm;
