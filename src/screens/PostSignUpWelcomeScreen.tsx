import { useEffect, useMemo, useState } from 'react';
import { IOnboardingTab } from '../types/onboarding';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import ScrummyLogo from '../components/branding/scrummy_logo';

import { useNavigate } from 'react-router-dom';
import TabProgressDots from '../components/shared/TabProgressDots';
import SecondaryText from '../components/shared/SecondaryText';
import { useOnboarding } from '../components/onboarding/OnboardingDataProvider';
import { useAthletes } from '../contexts/AthleteContext';
import { PlayerGameCard } from '../components/player/PlayerGameCard';
import { useJoinLeague } from '../hooks/leagues/useJoinLeague';
import { Toast } from '../components/ui/Toast';
import { AnimatePresence, motion } from 'framer-motion';

// Helper to ensure we only render players with valid image URLs
const hasValidImageUrl = (u?: string | null): boolean => {
  if (typeof u !== 'string') return false;
  const trimmed = u.trim();
  if (!trimmed) return false;
  // Accept absolute http(s) or server-relative paths (e.g., /images/...)
  return trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/');
};

export default function PostSignUpWelcomeScreen() {
  const [currIndex, setIndex] = useState(0);
  const isWelcomeComplete = currIndex === tabs.length - 1;

  const handleNextIndex = () => {
    if (currIndex < tabs.length - 1) {
      setIndex(currIndex + 1);
    } else {
      setIndex(0);
    }
  };

  // const handleProceedWithLeagues = () => {
  //   try {
  //     localStorage.setItem('league_tab', 'discover');
  //   } catch { }
  //   navigate('/leagues');
  // };

  // const handleSkipToDashboard = () => {
  //   navigate('/dashboard');
  // };

  // Preload all onboarding images on mount so tab switches are instant
  useEffect(() => {
    const urls = Array.from(
      new Set(
        tabs.map(t => t.imageUrl).filter((u): u is string => typeof u === 'string' && u.length > 0)
      )
    );
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
      img.onerror = () => console.warn('Preload failed:', url);
    });
  }, []);

  return (
    <div className="flex dark:bg-black flex-col w-full p-2 lg:px-[30%] h-[100vh] overflow-y-hidden white">
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        {currIndex === 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currIndex}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center p-4"
            >
              <InitialWelcomeScreen />
            </motion.div>
          </AnimatePresence>
        )}

        {currIndex === 1 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currIndex}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center p-4"
            >
              <BudgetingWelcomeScreen />
            </motion.div>
          </AnimatePresence>
        )}

        {currIndex === 2 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currIndex}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center p-4"
            >
              <RallyFriendsScreen />
            </motion.div>
          </AnimatePresence>
        )}

        {currIndex === 3 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currIndex}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center p-4"
            >
              <WelcomeCTAScreen />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
      <div className="flex flex-1  w-full p-4 justify-end flex-col gap-4 items-center">
        {!isWelcomeComplete && (
          <PrimaryButton
            onClick={handleNextIndex}
            className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
          >
            {'Continue'}
          </PrimaryButton>
        )}

        {/* Progress Dots */}
        <TabProgressDots items={tabs} currIndex={currIndex} setIndex={setIndex} />
      </div>
    </div>
  );
}

export const tabs: IOnboardingTab[] = [
  {
    title: 'Learn About SCRUMMY coins',
    description:
      'You’ve made the squad! From here on, it’s all tries, conversions, and bragging rights — with far fewer bruises than the real thing. Time to lace up and dive in.',
    imageUrl: '/images/onboarding/Scrummy Background Gradient.png',
  },

  {
    title: 'Rally Your Friends',
    description:
      'You’ve made the squad! From here on, it’s all tries, conversions, and bragging rights — with far fewer bruises than the real thing. Time to lace up and dive in.',
    imageUrl: '/images/onboarding/Scrummy Background Gradient.png',
  },

  {
    title: 'Rally Your Friends',
    description:
      'You’ve made the squad! From here on, it’s all tries, conversions, and bragging rights — with far fewer bruises than the real thing. Time to lace up and dive in.',
    imageUrl: '/images/onboarding/Scrummy Background Gradient.png',
  },

  {
    title: 'Last Onboarding Screen',
    description:
      'Explore official Scrummy Leagues and fan-made competitions. Join the ruck, take on challengers from across the globe, and fight for a spot at the top of the table.',
    imageUrl: '/images/onboarding/Discover Leagues.png',
  },
];

function InitialWelcomeScreen() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto items-center justify-start">
      <ScrummyLogo className="w-52 h-52" />

      {/* <div>
        <img
          src={'/images/onboarding/Compare Players.png'}
          className='rounded-xl'
        />
      </div> */}

      {/* Coins Floating Glowings in Yellow */}
      {/* Cline implement this */}

      <div className="">
        <h1 className="text-2xl text-center font-extrabold dark:text-white">
          Let's get you warmed up to join the SCRUM!
        </h1>
      </div>

      <div className="flex flex-col items-center text-center justify-center">
        {/* <p className='font-bold' >Use your SCRUMMY coins to pick your players</p> */}
        <SecondaryText className="text-lg text-center">
          {/* You have 240 coins - talent is everywhere if you look closely and lots of data to analyse to chose your Dream Team */}
          Don't worry, it's less bruises and more bragging rights from here
        </SecondaryText>
      </div>
    </div>
  );
}

function BudgetingWelcomeScreen() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto items-center justify-start">
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'/images/onboarding/Compare Players.png'} className="rounded-xl" />
      </div>

      {/* Coins Floating Glowings in Yellow */}
      {/* Cline implement this */}

      <div className="">
        <h1 className="text-lg text-center font-extrabold">
          Use your SCRUMMY coins to pick your favorite players!
        </h1>
      </div>

      <div className="flex flex-col items-center text-center justify-center">
        {/* <p className='font-bold' >Use your SCRUMMY coins to pick your players</p> */}
        <SecondaryText className="text-lg text-center">
          You have 240 coins - talent is everywhere, pick the top 6 players to create your Dream
          Team. Use SCRUMMY data to chose carefully!
        </SecondaryText>
      </div>
    </div>
  );
}

function RallyFriendsScreen() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto items-center justify-start">
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'/images/onboarding/Create Your Own Leagues.png'} className="rounded-xl" />
      </div>

      {/* Coins Floating Glowings in Yellow */}
      {/* Cline implement this */}

      <div className="">
        <h1 className="text-lg text-center font-extrabold">Rally Your Friends</h1>
      </div>

      <div className="flex flex-col items-center text-center justify-center">
        {/* <p className='font-bold' >Use your SCRUMMY coins to pick your players</p> */}
        <SecondaryText className="text-lg text-center">
          Create your own league, invite friends, and compete for bragging rights. SCRUMMY has
          in-depth player analytics, live updates, and everything you need for fantasy rugby
        </SecondaryText>
      </div>
    </div>
  );
}

function WelcomeCTAScreen() {
  const { featuredLeague, featuredPlayers } = useOnboarding();
  const { athletes } = useAthletes();
  const navigate = useNavigate();

  const { isLoading: isJoining, handleJoinLeague, error, clearError } = useJoinLeague();

  const top5Athletes = useMemo(() => {
    return [...athletes]
      .filter(a => hasValidImageUrl(a.image_url))
      .sort((a, b) => {
        return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0);
      })
      .slice(0, 3);
  }, [athletes]);

  const handleStartBuilding = async () => {
    if (featuredLeague) {
      await handleJoinLeague(featuredLeague, `/league/${featuredLeague.id}?journey=team-creation`);
    } else {
      navigate('/leagues?active_tab=discover');
    }
  };

  const handleLookAround = () => {
    navigate('/dashboard');
  };

  if (!featuredLeague || featuredPlayers.length === 0) {
    return (
      <div className="text-center flex flex-col gap-4 h-full items-center justify-start">
        <ScrummyLogo className="w-52 h-52 " />

        <div className="grid grid-cols-3 flex-wrap gap-4">
          {top5Athletes.map(a => {
            return (
              <PlayerGameCard
                player={a}
                key={a.tracking_id}
                className="h-[200px]"
                hideTeamLogo
                hidePrice
                detailsClassName="pb-0"
              />
            );
          })}
        </div>

        <div>
          <h1 className="text-3xl font-bold  ">Building Your Team</h1>
        </div>

        <div>
          <p>Pick your team of 5 players, and compete globally and play with your friends!</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <PrimaryButton
            onClick={handleStartBuilding}
            isLoading={isJoining}
            disabled={isJoining}
            className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
          >
            Start Building Your Team
          </PrimaryButton>

          <button
            onClick={handleLookAround}
            disabled={isJoining}
            className="rounded-3xl text-slate-700 dark:text-slate-200 w-fit p-4 h-10 w-22 px-10 py-2"
          >
            Look Around First
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-6 h-full w-full overflow-x-auto items-center">
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 items-center">
        <ScrummyLogo className="w-56 h-56 lg:w-72 lg:h-72" />

        <div className="grid grid-cols-3 gap-2">
          {featuredPlayers
            .filter(a => hasValidImageUrl(a.image_url))
            .map(a => {
              return (
                <PlayerGameCard
                  player={a}
                  className="h-[200px] md:h-[250px]"
                  detailsClassName="pb-10"
                  hideTeamLogo
                  hidePrice
                  key={a.tracking_id}
                />
              );
            })}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black text-center dark:text-white">
            The 2025 Women's World Cup Is Here!
          </h1>

          <div className="flex flex-col items-center text-center font-semibold text-md">
            <SecondaryText className="text-md">You are now ready to go!</SecondaryText>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <PrimaryButton
            onClick={handleStartBuilding}
            isLoading={isJoining}
            disabled={isJoining}
            className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
          >
            Start Picking Your Team
          </PrimaryButton>

          {/* <button
            onClick={handleLookAround}
            disabled={isJoining}
            className="rounded-3xl text-slate-700 dark:text-slate-200 w-fit p-4 h-10 w-22 px-10 py-2"
          >
            Look Around First
          </button> */}
        </div>

        {error && (
          <Toast
            message={error}
            onClose={clearError}
            duration={3000}
            isVisible={error !== undefined}
            type="error"
          />
        )}
      </div>
    </div>
  );
}
