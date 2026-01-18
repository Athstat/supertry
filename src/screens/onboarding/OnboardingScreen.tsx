import { ReactNode, useState } from 'react';
import PrimaryButton from '../../components/ui/buttons/PrimaryButton';
import TabProgressDots from '../../components/ui/bars/TabProgressDots';
import { AnimatePresence, motion } from 'framer-motion';
import ScrummyMatrixBackground from '../../components/ui/containers/ScrummyMatrixBackground';
import { OnboardingMyTeamSlide } from '../../components/onboarding/slides/OnboardingBudgetingSlide';
import { OnboardingCTASlide } from '../../components/onboarding/slides/OnboardingCTASlide';
import { OnboardingFriendsSlide } from '../../components/onboarding/slides/OnboardingFriendsSlide';
import { OnboardingWelcomeSlide } from '../../components/onboarding/slides/OnboardingWelcomeSlide';
import OnboardingFavouriteTeamSlide from '../../components/onboarding/slides/OnboardingFavouriteTeamSlide';
import OnboardingProvider from '../../contexts/OnboardingContext';
import { OnboardingFixturesSlide } from '../../components/onboarding/slides/OnboardingFixturesSlide';
import { OnboardingPickemSlide } from '../../components/onboarding/slides/OnboardingPickemSlide';


/** Renders the onboarding screen */
export default function OnBoardingScreen() {

  return (
    <OnboardingProvider>
      <Content />
    </OnboardingProvider>
  )

}


function Content() {
  const [currIndex, setCurrentIndex] = useState<number>(0);

  const onboardingSlides: ReactNode[] = [
    <OnboardingWelcomeSlide />,
    <OnboardingFavouriteTeamSlide />,
    <OnboardingMyTeamSlide />,
    <OnboardingFriendsSlide />,
    <OnboardingFixturesSlide />,
    <OnboardingPickemSlide />,
    <OnboardingCTASlide />
  ]

  const isWelcomeComplete = currIndex > onboardingSlides.length - 2;

  const handleNextSlide = () => {
    setCurrentIndex(prev => prev + 1);
  }

  const handleJumpToIndex = (index: number) => {
    setCurrentIndex(index);
  }

  return (
    <ScrummyMatrixBackground>
      <div className="flex flex-col w-full p-2 lg:px-[30%] h-[100vh] overflow-y-hidden white">
        <div className="flex flex-col overflow-y-auto no-scrollbar">

          <AnimatePresence mode="wait">
            <motion.div
              key={currIndex}
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '-100%' }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="flex flex-col items-center justify-center p-4 dark:text-white"
            >
              {onboardingSlides[currIndex]}
            </motion.div>
          </AnimatePresence>

        </div>
        <div className="flex flex-1  w-full p-4 justify-end flex-col gap-4 items-center">
          {!isWelcomeComplete && (
            <PrimaryButton
              onClick={handleNextSlide}
              className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
            >
              {'Continue'}
            </PrimaryButton>
          )}

          {/* Progress Dots */}
          <TabProgressDots items={onboardingSlides} currIndex={currIndex} setIndex={handleJumpToIndex} />
        </div>
      </div>
    </ScrummyMatrixBackground>
  );
}