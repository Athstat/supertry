import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import ScrummyLogo from '../../components/branding/scrummy_logo';
import PrimaryButton from '../../components/shared/buttons/PrimaryButton';
import SecondaryText from '../../components/shared/SecondaryText';
import { useGuestLogin } from '../../hooks/auth/useGuestLogin';
import { ErrorMessage } from '../../components/ui/ErrorState';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    isLoading,
    error,
    handleGuestLogin,
    deviceId
  } = useGuestLogin('/post-signup-welcome');

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // const googleLogin = useGoogleLogin({
  //   onSuccess: async tokenResponse => {
  //     try {
  //       setError(null);
  //       const result = await authService.googleOAuth(tokenResponse.code);

  //       if (result.error) {
  //         setError(result.error.message || 'Google sign-in failed');
  //         return;
  //       }

  //       const authUser = result.data?.user;
  //       const accessToken = result.data?.token;

  //       if (authUser && accessToken) {
  //         authTokenService.setAccessToken(accessToken);
  //         authTokenService.saveUserToLocalStorage(authUser);
  //         navigate('/post-signup-welcome');
  //       }

  //       // Mark first visit completed and navigate
  //       markFirstVisitCompleted();
  //       setError('Google sign-in failed. Please try again.');

  //     } catch (err: any) {
  //       console.error('Google OAuth error:', err);
  //       setError('Google sign-in failed. Please try again.');
  //     }
  //   },
  //   onError: () => setError('Google sign-in failed. Please try again.'),
  //   flow: 'auth-code',
  // });

  // const handleAppleSuccess = async (response: any) => {
  //   if (!response.authorization || !response.authorization.id_token) {
  //     setError('Apple sign-in failed. Please try again.');
  //     return;
  //   }

  //   try {
  //     setError(null);
  //     const result = await authService.appleOAuth(response.authorization.id_token);

  //     if (result.error) {
  //       setError(result.error.message || 'Apple sign-in failed');
  //       return;
  //     }

  //     const authUser = result.data?.user;
  //     const accessToken = result.data?.token;

  //     if (authUser && accessToken) {
  //       authTokenService.setAccessToken(accessToken);
  //       authTokenService.saveUserToLocalStorage(authUser);
  //       navigate('/post-signup-welcome');
  //     }

  //     // Mark first visit completed and navigate
  //     markFirstVisitCompleted();
  //     navigate('/post-signup-welcome');
  //   } catch (err: any) {
  //     console.error('Apple OAuth error:', err);
  //     setError('Apple sign-in failed. Please try again.');
  //   }
  // };

  // const handleAppleError = (error: any) => {
  //   console.error('Apple sign-in failed:', error);
  //   setError('Apple sign-in failed. Please try again.');
  // };

  const navigateToSignin = () => {
    navigate("/signin");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-dark-850 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md flex flex-col gap-2 items-center"
      >
        <ScrummyLogo className="w-60 h-60 md:w-60 md:h-60 -mb-5" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center">
            Welcome to SCRUMMY
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <p className="mt-3 lg:text-xl text-gray-600 dark:text-gray-300 text-center">
            You've officially joined the scrum! Don't worry, it's less bruises and more bragging
            rights from here.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className='flex flex-1 flex-col gap-2 items-center justify-center p-4 w-full' >
          
          {deviceId && <PrimaryButton
            className='w-full py-3 animate-glow'
            onClick={handleGuestLogin}
            isLoading={isLoading}
          >
            Get Started!
          </PrimaryButton>}

          {error && <ErrorMessage message={error} />}

          {!deviceId && <PrimaryButton onClick={navigateToSignin} className='w-full py-3 animate-glow' >
            Sign In
          </PrimaryButton>}

          {deviceId && (
            <div onClick={navigateToSignin} >
              <SecondaryText className='underline cursor-pointer hover:text-slate-800 dark:text-slate-300' >
                Already Part of The Scrum? Sign In
              </SecondaryText>
            </div>
          )}

        </motion.div>
      </motion.div>
    </div>
  );
}
