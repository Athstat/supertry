import { useEffect, useState } from 'react';
import { IOnboardingTab } from '../types/onboarding';
import PageView from './PageView';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import ScrummyLogo from '../components/branding/scrummy_logo';

import { useNavigate } from 'react-router-dom';
import TabProgressDots from '../components/shared/TabProgressDots';
import SecondaryText from '../components/shared/SecondaryText';

export default function PostSignUpWelcomeScreen() {
  const featuredLeagueId = 'c50b2d32-fdf1-4480-88d4-219cdd87cab0';
  const [currIndex, setIndex] = useState(0);
  const navigate = useNavigate();

  const isIndexValid = currIndex >= 0 && currIndex < tabs.length;
  const currTab = isIndexValid ? tabs[currIndex] : undefined;

  const isWelcomeComplete = currIndex === tabs.length - 1;

  const handleNextIndex = () => {
    if (currIndex < tabs.length - 1) {
      setIndex(currIndex + 1);
    } else {
      setIndex(0);
    }
  };

  const handleProceedWithLeagues = () => {
    try {
      localStorage.setItem('league_tab', 'discover');
    } catch { }
    navigate('/leagues');
  };

  const handleSkipToDashboard = () => {
    navigate('/dashboard');
  };

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
    <PageView className="flex flex-col w-full p-4 h-screen overflow-y-hidden items-center justify-center white">

      {currIndex === 1 && <div className="flex flex-row w-full h-20 items-center justify-center">
        <ScrummyLogo className="h-20" />
      </div>}


      {currIndex === 0 && (
        <IntialWelcomeScreen />
      )}

      <div className="flex flex-1  w-full p-4 justify-end flex-col gap-4 items-center">
        {!isWelcomeComplete && (
          <PrimaryButton
            onClick={handleNextIndex}
            className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
          >
            {'Continue'}
          </PrimaryButton>
        )}

        {isWelcomeComplete && (
          <div className="flex flex-col items-center justify-center">
            <PrimaryButton
              onClick={handleProceedWithLeagues}
              className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
            >
              Get Started With Leagues
            </PrimaryButton>

            <button
              onClick={handleSkipToDashboard}
              className="rounded-3xl text-slate-700 w-fit p-4 h-10 w-22 px-10 py-2"
            >
              Look Around First
            </button>
          </div>
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

function JoinFeatureLeagueScreen() {
  return (
    <div>

    </div>
  )
}
