import { useState } from "react";
import { IOnboardingTab } from "../types/onboarding";
import PageView from "./PageView";
import OnboardingTab from "../components/onboarding/OnboardingTab";
import PrimaryButton from "../components/shared/buttons/PrimaryButton";
import ScrummyLogo from "../components/branding/scrummy_logo";
import { twMerge } from "tailwind-merge";

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
        <OnboardingTab
          tab={currTab}
          className="w-full items-center justify-center flex flex-col flex-2 p-4"
        />
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
              <div
                key={index}
                className={twMerge(
                  "w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700",
                  curr && 'w-12'
                )}
              >

              </div>
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
    description: "You've officially joined the scrum! Don't worry, it's less bruises and more bragging rights from here.",
    imageUrl: "/public/images/onboarding/Discover Leagues.png"
  },

  {
    title: "Discover Leagues",
    description: "Discover Scrummy and Community Created Public Leagues to join, to and battle it out to be the best in world",
    imageUrl: "/public/images/onboarding/Discover Leagues.png"
  },

  {
    title: "Build Your Team",
    description: "Draft your dream team of players, but there is a catch, you have 240 SCRUMMY coins to spend. Make informed descisions by checkout player stats or even comparing players!",
    imageUrl: "/public/images/onboarding/Compare Players.png"
  },

  {
    title: "Create Your Own Leagues",
    description: "You can create your own fantasy leagues, and manage it as a 'Commissioner'. You can manage things like league visibility, league title and description.",
    imageUrl: "/public/images/onboarding/Create Your Own Leagues.png"
  },

  {
    title: "Invite Your Friends",
    description: "SCRUMMY like food is better enjoyed when shared. Invite your friends over and battle it out for glory. Also don't forget to have fun",
    imageUrl: "/public/images/onboarding/Invite Friends.png"
  }
]