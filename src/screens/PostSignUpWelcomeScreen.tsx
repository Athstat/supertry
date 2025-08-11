import { useState } from "react";
import { IOnboardingTab } from "../types/onboarding";
import PageView from "./PageView";
import OnboardingTab from "../components/onboarding/OnboardingTab";
import PrimaryButton from "../components/shared/buttons/PrimaryButton";
import ScrummyLogo from "../components/branding/scrummy_logo";

import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import TabProgressDots from "../components/shared/TabProgressDots";

export default function PostSignUpWelcomeScreen() {

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
  }

  const handleProceedWithLeagues = () => {
    navigate('/leagues')
  }

  const handleSkipToDashboard = () => {
    navigate('/dashboard');
  }

  return (
    <PageView className="flex flex-col w-full h-screen overflow-hidden white" >

      <div className="flex flex-row w-full h-fit items-center justify-center" >
        <ScrummyLogo className="" />
      </div>

      {currTab &&

        <AnimatePresence mode="wait" >
          <motion.div
            key={currIndex}
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center p-4"
          >
            <OnboardingTab tab={currTab} />
          </motion.div>
        </AnimatePresence>
      }

      <div className="flex flex-1  w-full p-4 justify-end flex-col gap-4 items-center" >

        {!isWelcomeComplete && <PrimaryButton onClick={handleNextIndex} className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2" >
          {"Continue"}
        </PrimaryButton>}

        {isWelcomeComplete && <div className="flex flex-col items-center justify-center" >
          <PrimaryButton onClick={handleProceedWithLeagues} className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2" >
            Get Started With Leagues
          </PrimaryButton>

          <button
            onClick={handleSkipToDashboard}
            className="rounded-3xl text-slate-700 w-fit p-4 h-10 w-22 px-10 py-2"
          >
            Look Around First
          </button>
        </div>}

        {/* Progress Dots */}
        <TabProgressDots
          items={tabs}
          currIndex={currIndex}
          setIndex={setIndex}
        />

      </div>

    </PageView>
  )

}


const tabs: IOnboardingTab[] = [
  {
    title: "Welcome to The Scrum",
    description: "You’ve made the squad! From here on, it’s all tries, conversions, and bragging rights — with far fewer bruises than the real thing. Time to lace up and dive in.",
    imageUrl: "/public/images/onboarding/Scrummy Background Gradient.png"
  },

  {
    title: "Discover Leagues",
    description: "Explore official Scrummy Leagues and fan-made competitions. Join the ruck, take on challengers from across the globe, and fight for a spot at the top of the table.",
    imageUrl: "/public/images/onboarding/Discover Leagues.png"
  },

  {
    title: "Build Your Team",
    description: "Assemble your dream 5 with just 240 SCRUMMY coins in the bank. Scout player stats, compare the form, and make tactical picks like a seasoned head coach.",
    imageUrl: "/public/images/onboarding/Compare Players.png"
  },

  {
    title: "Create Leagues",
    description: "Be the Commissioner — your pitch, your rules. Set league titles, tweak visibility, and host the fiercest fantasy battles since Jonah Lomu ran over Mike Catt.",
    imageUrl: "/public/images/onboarding/Create Your Own Leagues.png"
  },

  {
    title: "Invite Your Friends",
    description: "Like a post-match braai, fantasy rugby is better shared. Rally your mates, start the banter, and play for glory, honour, and the ultimate bragging rights.",
    imageUrl: "/public/images/onboarding/Invite Friends.png"
  },

  {
    title: "Lets Get You Started",
    description: "The ref’s blown the whistle and it’s game time! Choose your league, pick your squad, and get ready to rack up the points",
    imageUrl: "/public/images/onboarding/Join Fantasy Leagues.png"
  }
]
