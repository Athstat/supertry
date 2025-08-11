import { useState } from "react";
import { IOnboardingTab } from "../types/onboarding";
import PageView from "./PageView";
import OnboardingTab from "../components/onboarding/OnboardingTab";
import PrimaryButton from "../components/shared/buttons/PrimaryButton";
import ScrummyLogo from "../components/branding/scrummy_logo";
import { twMerge } from "tailwind-merge";

import { AnimatePresence, motion } from 'framer-motion';

export default function PostSignUpWelcomeScreen() {

  const [currIndex, setIndex] = useState(0);

  const isIndexValid = currIndex >= 0 && currIndex < tabs.length;
  const currTab = tabs[currIndex];


  const handleNextIndex = () => {
    if (currIndex < tabs.length - 1) {
      setIndex(currIndex + 1);
    } else {
      setIndex(0);
    }
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

        <PrimaryButton onClick={handleNextIndex} className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2" >
          {currIndex == 0 ? 'Get Started' : "Continue"}
        </PrimaryButton>

        {/* Progress Dots */}
        <div className="flex flex-row items-center gap-1 justify-center" >
          {tabs.map((_, index) => {

            const curr = index === currIndex;

            return (
              <motion.div
                key={index}
                onClick={() => setIndex(index)}
                initial={{ width: curr ? 12 : 4 }}
                className={twMerge(
                  "rounded-full h-3 bg-slate-300 dark:bg-slate-700",
                )}

                animate={{
                  width: curr ? 40 : 10,
                  transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                  },
                }}
              >

              </motion.div>
            )
          })}
        </div>

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
  }
]
