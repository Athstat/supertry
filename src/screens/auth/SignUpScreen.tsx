import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, User } from 'lucide-react';
import { motion, MotionProps } from 'framer-motion';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { SignUpForm, UserRepresentation } from '../../types/auth';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../services/anayticsService';
import { emailValidator } from '../../utils/stringUtils';
import { requestPushPermissionsAfterLogin } from '../../utils/bridgeUtils';

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

export function SignUpScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep] = useState(1); // Keeping this for compatibility
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<SignUpForm>({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    nationality: undefined,
    favoriteTeam: undefined,
  });

  // Validate all fields and submit the form directly instead of going to next step
  const handleNext = async () => {
    // Validate email and password
    if (!form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!emailValidator(form.email)) {
      setError('Please enter a valid email');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!form.username) {
      setError('Please provide a username');
      return;
    }

    if (form.password.length < 8) {
      setError('Password should be atleast 8 characters long');
      return;
    }

    // Clear any previous errors and submit the form
    setError(null);

    // Call handleSubmit programmatically
    const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleSubmit(fakeEvent);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Prepare user data for Keycloak
      const userData: UserRepresentation = {
        username: form.username,
        email: form.email,
        firstName: form.username, // Using username as firstName for compatibility
        lastName: '', // Empty lastName for compatibility
        enabled: true,
        emailVerified: false,
        credentials: [
          {
            type: 'password',
            value: form.password,
            temporary: false,
          },
        ],
        attributes: {
          nationality: form.nationality ? form.nationality.code : null,
          favoriteTeam: form.favoriteTeam ? form.favoriteTeam.id : null,
          terms_and_conditions: [Math.random()], // Adding terms acceptance like in mobile app
        },
      };

      // Register the user with both Keycloak and games database
      const res = await authService.createGamesUser(userData);

      console.log('Sign Up Res ', res);

      if (res === 'User already exists') {
        setError('An account with this email already exists');
        setIsLoading(false);
        return;
      }

      // First login the user to set authentication state
      analytics.trackUserSignUp('Email');

      try {
        // Wait for login to complete successfully
        await login(form.email, form.password);

        // Only navigate to welcome screen after successful login
        navigate('/post-signup-welcome');
      } catch (loginErr) {
        console.error('Auto-login failed:', loginErr);

        // Even if auto-login fails, request push permissions since user is registered
        requestPushPermissionsAfterLogin();

        // Set authenticated state manually to avoid redirect to signin
        setIsLoading(false);

        // Force navigation to welcome screen even if login fails
        navigate('/post-signup-welcome', { replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of fantasy rugby players">
      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
                  value={form.username}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
                <User className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                />
                <Mail className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  minLength={8}
                />
                <MotionButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </MotionButton>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full px-4 py-3 bg-white dark:bg-dark-800/40 border border-gray-300 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100"
                  value={form.confirmPassword}
                  minLength={8}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <Lock className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <MotionButton
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-700 to-primary-600 via-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-600 hover:via-primary-650 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
              {!isLoading && <ArrowRight size={20} />}
            </MotionButton>
          </div>
        )}
        {/* Steps 2 and 3 removed - country and team selection no longer needed */}

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
