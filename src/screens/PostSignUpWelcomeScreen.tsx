import { useEffect, useMemo, useState } from 'react';
import { IOnboardingTab } from '../types/onboarding';
import PageView from './PageView';
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
    <PageView className="flex dark:bg-black flex-col w-full p-4 h-screen overflow-y-hidden items-center justify-center white">

      {currIndex === 1 && <div className="flex flex-row w-full h-20 items-center justify-center">
        <ScrummyLogo className="h-20" />
      </div>}


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
            <IntialWelcomeScreen />
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
            <WelcomeCTAScreen />
          </motion.div>
        </AnimatePresence>

      )}

      <div className="flex flex-1  w-full p-4 justify-end flex-col gap-4 items-center">
        {!isWelcomeComplete && (
          <PrimaryButton
            onClick={handleNextIndex}
            className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
          >
            {'Get Started!'}
          </PrimaryButton>
        )}

        {/* Progress Dots */}
        <TabProgressDots items={tabs} currIndex={currIndex} setIndex={setIndex} />
      </div>
    </PageView>
  );
}

export const tabs: IOnboardingTab[] = [
  {
    title: 'Welcome to The Scrum',
    description:
      'You’ve made the squad! From here on, it’s all tries, conversions, and bragging rights — with far fewer bruises than the real thing. Time to lace up and dive in.',
    imageUrl: '/images/onboarding/Scrummy Background Gradient.png',
  },

  {
    title: 'Last Onboarding Screen',
    description:
      'Explore official Scrummy Leagues and fan-made competitions. Join the ruck, take on challengers from across the globe, and fight for a spot at the top of the table.',
    imageUrl: '/images/onboarding/Discover Leagues.png',
  }
];


function IntialWelcomeScreen() {



  return (
    <div className='flex flex-col gap-4 h-full overflow-y-auto items-center justify-center' >

      <ScrummyLogo className='w-44 h-44' />

      <div className='' >
        <h1 className='text-4xl text-center font-extrabold' >Welcome to SCRUMMY!</h1>
      </div>

      <div className='flex flex-col items-center' >

        <SecondaryText className='text-lg text-center' >
          You've officially joined the scrum!
          Don't worry, it's less bruises and more bragging rights from here.
        </SecondaryText>

      </div>
    </div>
  )
}

function WelcomeCTAScreen() {

  const { featuredLeague, featuredPlayers } = useOnboarding();
  const { athletes } = useAthletes();
  const navigate = useNavigate();

  const { isLoading: isJoining, handleJoinLeague, error, clearError } = useJoinLeague();

  const top5Athletes = useMemo(() => {
    return [...athletes].sort((a, b) => {
      return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0);
    }).slice(0, 6);
  }, [athletes]);

  const handleStartBuilding = async () => {
    if (featuredLeague) {
      await handleJoinLeague(
        featuredLeague,
        `/league/${featuredLeague.id}?hint=my_team`
      )
    } else {
      navigate('/leagues?active_tab=discover')
    }

  }

  const handleLookAround = () => {
    navigate('/dashboard');
  }

  if (!featuredLeague || featuredPlayers.length === 0) {
    return (
      <div className='text-center flex flex-col gap-4 h-full justify-center overflow-y-auto' >

        <div className='grid grid-cols-3 flex-wrap gap-4' >
          {top5Athletes.map((a) => {
            return (
              <PlayerGameCard
                player={a}
                key={a.tracking_id}
                className='h-[150px]'
                hideTeamLogo
                hidePrice
              />
            )
          })}
        </div>

        <div>
          <h1 className='text-3xl font-bold  ' >Building Your Team</h1>
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
    )
  }

  return (
    <div className='flex flex-col gap-8 h-full overflow-x-auto items-center' >

      <div className='grid grid-cols-3 gap-4' >
        {featuredPlayers.map((a) => {
          return (
            <PlayerGameCard
              player={a}
              key={a.tracking_id}
              className='h-[150px]'
              hideTeamLogo
              hidePrice
            />
          )
        })}
      </div>

      <div className='flex flex-col gap-2' >
        <h1 className='text-2xl font-extrabold text-center' >Women's World Cup Is Here</h1>

        <div className='flex flex-col items-center text-center font-semibold text-md' >
          <SecondaryText>Pick your dream team of 5 Players, Compete Globaly and with Friends!</SecondaryText>
        </div>
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

      {error && <Toast
        message={error}
        onClose={clearError}
        duration={3000}
        isVisible={error !== undefined}
        type='error'
      />}

    </div>
  )
}
