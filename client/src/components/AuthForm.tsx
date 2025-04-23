import { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import AuthLayout from "./AuthLayout";

interface AuthFormProps {
  onSubmit: (email: string, password: string, confirmPassword?: string) => void;
  onGoogleLoginSuccess?: (response: CredentialResponse) => void;
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
    if (onGoogleLoginSuccess) onGoogleLoginSuccess(response);
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
      // showAdminLink={type !== "admin-login"}
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
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={
                type === "signup" ? "new-password" : "current-password"
              }
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {type === "signup" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="mt-1">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {type === "signup" ? "Sign up" : "Sign in"}
          </button>
        </div>
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
            onError={() => console.log("Google Login Failed")}
            useOneTap={type === "login"}
          />
        </div>
      </div>
    </AuthLayout>
  );
};

export default AuthForm;
