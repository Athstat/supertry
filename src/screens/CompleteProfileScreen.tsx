import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, User } from 'lucide-react';
import { authService } from '../services/authService';
import ScrummyLogo from '../components/branding/scrummy_logo';
import RoundedCard from '../components/shared/RoundedCard';
import { ClaimGuestAccountReq } from '../types/auth';
import InputField, { PasswordInputField } from '../components/shared/InputField';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import { useEmailUniqueValidator } from '../hooks/useEmailUniqueValidator';
import { authUserAtom, isGuestUserAtom } from '../state/authUser.atoms';
import { ScopeProvider } from 'jotai-scope';
import AuthUserDataProvider from '../components/auth/AuthUserDataProvider';
import FormErrorText from '../components/shared/FormError';
import NoContentCard from '../components/shared/NoContentMessage';
import { useAuth } from '../contexts/AuthContext';
import { requestPushPermissionsAfterLogin } from '../utils/bridgeUtils';

export function CompleteProfileScreen() {
  const atoms = [authUserAtom, isGuestUserAtom];

  return (
    <ScopeProvider atoms={atoms}>
      <AuthUserDataProvider>
        <ScreenContent />
      </AuthUserDataProvider>
    </ScopeProvider>
  );
}

function ScreenContent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { refreshAuthUser } = useAuth();

  const { emailTaken, isLoading: isEmailValidatorLoading } = useEmailUniqueValidator(
    formData.email
  );

  const isEmailTaken = !isEmailValidatorLoading && emailTaken;

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Validation failed');
      return;
    } else {
      console.log('Passed Validation');
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const data: ClaimGuestAccountReq = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      };

      const { data: res, error } = await authService.claimGuestAccount(data);

      if (res) {
        await refreshAuthUser();
        requestPushPermissionsAfterLogin();
        navigate('/dashboard');
        return;
      }

      setErrors(error?.message);
    } catch (error: any) {
      console.error('Error claiming account:', error);
      let errorMessage = error.message || 'Failed to complete profile. Please try again.';

      if (errorMessage.includes('string did not match')) {
        errorMessage =
          'Your username contains invalid characters. Use only letters, numbers, and underscores.';
      }

      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  if (!isGuestUserAtom) {
    return <NoContentCard className="Account has already been claimed" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-850">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800/70 border-b dark:border-slate-700 border-slate-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Complete Your Profile
          </h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <ScrummyLogo className="w-32 h-32 lg:w-48 lg:h-48" />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <RoundedCard className="rounded-lg dark:bg-slate-800/50 dark:border-slate-600 p-6 shadow-sm">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Complete your profile to enhance your experience and access your teams from any
              device.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <InputField
                  label="Username*"
                  placeholder="Username"
                  value={formData.username}
                  onChange={v => handleInputChange('username', v ?? '')}
                  required
                  id="username"
                  icon={<User className="w-4 h-4" />}
                />

                {errors?.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1">
                <InputField
                  label="Email*"
                  placeholder="Email"
                  required
                  value={formData.email}
                  onChange={v => handleInputChange('email', v?.toLowerCase() ?? '')}
                  id="email"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}

                {isEmailTaken && <FormErrorText error="Email is already taken by another user" />}
              </div>

              {/* Password Field */}
              <div>
                <PasswordInputField
                  label="Password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={v => handleInputChange('password', v ?? '')}
                  id="password"
                />

                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div>
                <PasswordInputField
                  label="Confirm Password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={v => handleInputChange('confirmPassword', v ?? '')}
                  id="confirm-password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Error */}
              {submitError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm"
                >
                  {submitError}
                </motion.div>
              )}

              {/* Submit Button */}
              <PrimaryButton
                type="submit"
                disbabled={isSubmitting || isEmailTaken || isEmailValidatorLoading}
                isLoading={isSubmitting}
                className="py-4"
              >
                <span>Complete Profile</span>
              </PrimaryButton>
            </form>
          </RoundedCard>
        </motion.div>
      </div>
    </div>
  );
}
