import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../../components/auth/AuthLayout";
import { useAuth } from "../../contexts/AuthContext";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  // If still loading, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Welcome to SCRUMMY"
      subtitle="The ultimate rugby fantasy sports experience"
    >
      <div className="mt-8 space-y-4">
        <Link
          to="/signin"
          className="block w-full bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors text-center"
        >
          Sign In
        </Link>
        <Link
          to="/signup"
          className="block w-full bg-white dark:bg-transparent text-primary-600 dark:text-primary-400 border border-primary-600 dark:border-primary-400 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-800/40 transition-colors text-center"
        >
          Create Account
        </Link>
      </div>
    </AuthLayout>
  );
}
