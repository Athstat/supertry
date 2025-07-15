import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User } from 'lucide-react';
import { motion, MotionProps } from 'framer-motion';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../contexts/AuthContext';
import { getDeviceId } from '../../utils/deviceIdUtils';
import EmailPasswordLoginBox from '../../components/auth/login/EmailPasswordLoginBox';

// Button animation variants
const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.01,
    transition: { type: 'linear', stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.98 },
};

// Create a typed motion button component
const MotionButton = motion.button as React.ComponentType<
  MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>;

export function SignInScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  // Display environment variables for debugging (can be removed in production)
  // console.debug("Environment variables:", {
  //   clientId: process.env.REACT_APP_CLIENT_ID,
  //   tokenUrl: process.env.REACT_APP_KEYCLOAK_TOKEN_URL,
  //   grantType: process.env.REACT_APP_GRANT_TYPE,
  //   scope: process.env.REACT_APP_SCOPE,
  // });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Use the login method from AuthContext
      await login(form.email, form.password);

      // Don't navigate - AuthRoute will automatically redirect when isAuthenticated changes
    } catch (err) {
      // Handle login error
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setError(null);
    setIsGuestLoading(true);

    try {
      // Get the device ID which is used as the guest identifier
      const deviceId = await getDeviceId();

      // Construct guest email - this matches the format in authService.createGuestUser
      const guestEmail = `${deviceId}@devices.scrummy-app.ai`;
      const guestPassword = deviceId;

      console.log('Attempting to sign in with guest credentials');

      // Login with guest credentials
      await login(guestEmail, guestPassword);

      // Set the guest account flag in localStorage if it's not already set
      localStorage.setItem('is_guest_account', 'true');

      // Don't navigate - AuthRoute will automatically redirect when isAuthenticated changes
    } catch (err) {
      console.error('Guest login error:', err);
      setError(
        err instanceof Error
          ? 'Guest account not found or error signing in. Try creating a new account.'
          : 'Failed to sign in as guest. Please try again.'
      );
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <div className="mt-8 space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

       <EmailPasswordLoginBox />

        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
          <div className="text-sm px-2 text-gray-500 dark:text-gray-400 bg-white dark:bg-dark-850">
            or
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
        </div>

        <MotionButton
          type="button"
          onClick={handleGuestLogin}
          disabled={isGuestLoading}
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-800/40 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          variants={buttonVariants}
          initial="initial"
          whileHover="hover"
          whileTap="tap"
        >
          {isGuestLoading ? (
            'Signing in as guest...'
          ) : (
            <>
              <User className="mr-2 h-5 w-5" />
              <span>Continue as Guest</span>
            </>
          )}
        </MotionButton>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
