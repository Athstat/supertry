import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { ScrummyDarkModeLogo } from '../../components/branding/scrummy_logo';
import PrimaryButton from '../../components/shared/buttons/PrimaryButton';
import SecondaryText from '../../components/shared/SecondaryText';
import { useGuestLogin } from '../../hooks/auth/useGuestLogin';
import { ErrorMessage } from '../../components/ui/ErrorState';
import MovingRugbyPitch from '../../components/shared/MovingRugbyPitch';
import { FEATURED_PLAYER_IDS } from '../../components/onboarding/OnboardingDataProvider';
import { djangoAthleteService } from '../../services/athletes/djangoAthletesService';
import BetaTag from '../../components/branding/BetaTag';

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const { isLoading, error, handleGuestLogin } = useGuestLogin('/post-signup-welcome');

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Preload top featured player images as early as possible
  useEffect(() => {
    let cancelled = false;
    const preload = async () => {
      try {
        const ids = FEATURED_PLAYER_IDS.slice(0, 2);
        const players = await Promise.all(
          ids.map(async id => {
            try {
              return await djangoAthleteService.getAthleteById(id);
            } catch {
              return null;
            }
          })
        );

        if (cancelled) return;

        players
          .filter((p): p is NonNullable<typeof p> => !!p && typeof p.image_url === 'string')
          .forEach(p => {
            const url = p.image_url?.trim();
            if (!url) return;
            const img = new Image();
            img.src = url;
          });
      } catch {
        // silent fail - preloading is best-effort
      }
    };

    preload();
    return () => {
      cancelled = true;
    };
  }, []);

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
    navigate('/signin');
  };

  return (
    <MovingRugbyPitch className="h-[100vh] overflow-hidden flex flex-col items-center justify-center">
      <div className="flex z-50 bg-green-700/90 flex-col items-center overflow-y-auto justify-center h-[100vh] px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md flex flex-col gap-2 items-center"
        >
          <ScrummyDarkModeLogo className="w-60 h-60 md:w-60 md:h-60 -mb-5" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className="text-2xl md:text-3xl font-extrabold text-white text-center">
              IT'S ABOUT TO GET SCRUMMY
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <p className="mt-3 text-md lg:text-lg text-gray-300 text-center">
              Pick 6 Players, Compete Globally, Invite Your Friends, Play Free
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-1 flex-col gap-4 items-center justify-center p-4 w-full"
          >
            <PrimaryButton
              className="w-full py-3 animate-glow"
              onClick={handleGuestLogin}
              isLoading={isLoading}
            >
              <p>Get Started!!!</p>
              <BetaTag className="bg-white dark:bg-white text-blue-500 dark:text-blue-500 border-none dark:border-none" />
            </PrimaryButton>

            {error && <ErrorMessage message={error} />}

            <div onClick={navigateToSignin}>
              <SecondaryText className="underline cursor-pointer text-white">
                Already Part of The Scrum? Sign In
              </SecondaryText>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </MovingRugbyPitch>
  );
}
