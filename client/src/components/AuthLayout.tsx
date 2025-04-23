import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
  showAdminLink?: boolean;
}

const AuthLayout = ({
  title,
  children,
  footerText,
  footerLink,
  footerLinkText,
  showAdminLink = true,
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{footerText} </span>
            <Link
              to={footerLink}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {footerLinkText}
            </Link>
          </div>

          {showAdminLink && (
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">Admin? </span>
              <Link
                to="/admin-login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Login here
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
