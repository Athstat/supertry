import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { RegisterUserReq } from '../../types/auth';
import { useAuth } from '../../contexts/AuthContext';
import { analytics } from '../../services/analytics/anayticsService';
import { authService } from '../../services/authService';
import GuestLoginBox from '../../components/auth/login/GuestLoginBox';
import Experimental from '../../components/ui/ab_testing/Experimental';
import { ProgressIndicator } from '../../components/auth/signup/ProgressIndicator';
import { OnboardingStep1Username } from '../../components/auth/signup/OnboardingStep1Username';
import { OnboardingStep2Email } from '../../components/auth/signup/OnboardingStep2Email';
import { OnboardingStep3Password } from '../../components/auth/signup/OnboardingStep3Password';
import { OnboardingStep4Review } from '../../components/auth/signup/OnboardingStep4Review';

interface OnboardingState {
  username: string;
  email: string;
  password: string;
}

export function SignUpScreen() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [onboardingData, setOnboardingData] = useState<OnboardingState>({
    username: '',
    email: '',
    password: '',
  });

  // Navigation handlers
  const goToStep = (step: 1 | 2 | 3 | 4) => {
    setCurrentStep(step);
    setError(null);
  };

  // Step 1: Username handlers
  const handleUsernameChange = (username: string) => {
    setOnboardingData(prev => ({ ...prev, username }));
  };

  const handleStep1Next = () => {
    goToStep(2);
  };

  // Step 2: Email handlers
  const handleEmailChange = (email: string) => {
    setOnboardingData(prev => ({ ...prev, email }));
  };

  const handleStep2Next = () => {
    goToStep(3);
  };

  const handleStep2Back = () => {
    goToStep(1);
  };

  // Step 3: Password handlers
  const handlePasswordChange = (password: string) => {
    setOnboardingData(prev => ({ ...prev, password }));
  };

  const handleStep3Next = () => {
    goToStep(4);
  };

  const handleStep3Back = () => {
    goToStep(2);
  };

  // Step 4: Review handlers
  const handleEditUsername = () => {
    goToStep(1);
  };

  const handleEditEmail = () => {
    goToStep(2);
  };

  const handleEditPassword = () => {
    goToStep(3);
  };

  const handleStep4Back = () => {
    goToStep(3);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const registerData: RegisterUserReq = {
        email: onboardingData.email,
        password: onboardingData.password,
        username: onboardingData.username,
      };

      const { data: res, error: apiError } = await authService.registerUser(registerData);

      if (res) {
        analytics.trackUserSignUp('Email');

        const authUser = res.user;
        const accessToken = res.token;

        setAuth(accessToken, authUser);

        navigate('/post-signup-welcome', { replace: true });

        return;
      }

      // Handle API errors and return to relevant step
      const errorMessage = apiError?.message ?? 'Registration failed. Please try again.';
      setError(errorMessage);

      // Map errors to relevant steps
      if (errorMessage.toLowerCase().includes('email')) {
        goToStep(2);
      } else if (errorMessage.toLowerCase().includes('username')) {
        goToStep(1);
      } else if (errorMessage.toLowerCase().includes('password')) {
        goToStep(3);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join thousands of fantasy rugby players">
      <div>
        <div style={{ marginTop: -30 }}>
          <ProgressIndicator currentStep={currentStep} totalSteps={4} />

          {currentStep === 1 && (
            <OnboardingStep1Username
              username={onboardingData.username}
              onUsernameChange={handleUsernameChange}
              onNext={handleStep1Next}
            />
          )}

          {currentStep === 2 && (
            <OnboardingStep2Email
              email={onboardingData.email}
              onEmailChange={handleEmailChange}
              onNext={handleStep2Next}
              onBack={handleStep2Back}
            />
          )}

          {currentStep === 3 && (
            <OnboardingStep3Password
              password={onboardingData.password}
              onPasswordChange={handlePasswordChange}
              onNext={handleStep3Next}
              onBack={handleStep3Back}
            />
          )}

          {currentStep === 4 && (
            <OnboardingStep4Review
              username={onboardingData.username}
              email={onboardingData.email}
              password={onboardingData.password}
              onEditUsername={handleEditUsername}
              onEditEmail={handleEditEmail}
              onEditPassword={handleEditPassword}
              onSubmit={handleSubmit}
              onBack={handleStep4Back}
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>

        {/* {currentStep === 4 && (
          <>
            <Experimental>
              <div className="relative flex items-center justify-center mt-6">
                <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
                <div className="text-sm px-2 text-gray-500 dark:text-gray-400 ">or</div>
                <div className="border-t border-gray-300 dark:border-gray-700 w-full"></div>
              </div>
            </Experimental>

            <Experimental>
              <div className="mt-4">
                <GuestLoginBox />
              </div>
            </Experimental>
          </>
        )} */}

        <div className="text-center mt-6">
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
      </div>
    </AuthLayout>
  );
}
