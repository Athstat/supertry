import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, User } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { RegisterUserReq, SignUpForm } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../services/analytics/anayticsService';
import { emailValidator } from '../../utils/stringUtils';
import InputField, { PasswordInputField } from '../../components/shared/InputField';
import PrimaryButton from '../../components/shared/buttons/PrimaryButton';
import { useEmailUniqueValidator } from '../../hooks/useEmailUniqueValidator';
import FormErrorText from '../../components/shared/FormError';
import { authService } from '../../services/authService';
import GuestLoginBox from '../../components/auth/login/GuestLoginBox';
import AppleOAuthBox from '../../components/auth/oauth/AppleOAuthBox';
import GoogleOAuthBox from '../../components/auth/oauth/GoogleOAuthBox';
import Experimental from '../../components/shared/ab_testing/Experimental';

export function SignUpScreen() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
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

  const { emailTaken, isLoading: isEmailUniqueValidatorLoading } = useEmailUniqueValidator(
    form.email
  );
  const isEmailTaken = !isLoading && emailTaken;

  const isAllFieldsComplete = form.email && form.username && form.password && form.confirmPassword;
  const isPasswordsMatch = form.password === form.confirmPassword;

  // Validate all fields and submit the form directly instead of going to next step
  const validateForm = () => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    validateForm();

    try {
      if (!form.username) {
        setError('Username is required');
        return;
      }

      const registerData: RegisterUserReq = {
        email: form.email,
        password: form.password,
        username: form.username,
      };

      const { data: res, error } = await authService.registerUser(registerData);

      if (res) {
        analytics.trackUserSignUp('Email');

        const authUser = res.user;
        const accessToken = res.token;

        setAuth(accessToken, authUser);

        navigate('/post-signup-welcome', { replace: true });

        return;
      }

      setError(error?.message ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      setIsLoading(false);
    } finally {
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
              <InputField
                id="username"
                label="Username"
                placeholder="Username"
                type="text"
                required
                value={form.username}
                onChange={val =>
                  setForm(prev => ({
                    ...prev,
                    username: val,
                  }))
                }
                icon={<User className="h-5 w-5" />}
              />
            </div>

            <div className="flex flex-col gap-1">
              <InputField
                id="email"
                type="email"
                label="Email"
                placeholder="Email"
                required
                value={form.email}
                onChange={val => setForm(prev => ({ ...prev, email: val?.toLowerCase() ?? '' }))}
                icon={<Mail className="h-5 w-5" />}
              />

              {isEmailTaken && <FormErrorText error="Email is already taken" />}
            </div>

            <div>
              <PasswordInputField
                id="password"
                label="Password"
                placeholder="Password"
                value={form.password}
                onChange={val => setForm(prev => ({ ...prev, password: val ?? '' }))}
                minLength={8}
              />
            </div>

            <div>
              <PasswordInputField
                id="confirmPassword"
                label="Confirm Password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                minLength={8}
                onChange={val =>
                  setForm(prev => ({
                    ...prev,
                    confirmPassword: val ?? '',
                  }))
                }
              />
            </div>

            <PrimaryButton
              type="submit"
              disabled={
                !(
                  !isLoading &&
                  !isEmailTaken &&
                  !isEmailUniqueValidatorLoading &&
                  isAllFieldsComplete &&
                  isPasswordsMatch
                )
              }
              isLoading={isLoading}
              className="py-3"
            >
              {isLoading ? 'Creating Account...' : 'Complete Sign Up'}
              {!isLoading && <ArrowRight size={20} />}
            </PrimaryButton>
          </div>
        )}
        {/* Steps 2 and 3 removed - country and team selection no longer needed */}

        <Experimental>
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
            <div className="text-sm px-2 text-gray-500 dark:text-gray-400 ">or</div>
            <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
          </div>
        </Experimental>

        <Experimental>
          <GoogleOAuthBox />
          <AppleOAuthBox />
        </Experimental>

        <Experimental>
          <GuestLoginBox />
        </Experimental>

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
