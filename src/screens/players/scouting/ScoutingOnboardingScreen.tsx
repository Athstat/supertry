import ScrummyLogo from "../../../components/branding/scrummy_logo";
import OnboardingSlideShow from "../../../components/onboarding/OnboardingSlideShow";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import SecondaryText from "../../../components/ui/typography/SecondaryText";
import { useHideBottomNavBar, useHideTopNavBar } from "../../../hooks/navigation/useNavigationBars";

/** Renders the Scouting Onboarding Screens */
export default function ScoutingOnboardingScreen() {

  useHideBottomNavBar();
  useHideTopNavBar();

  return (
    <OnboardingSlideShow
      slides={[
        <Slide1 />,
        <Slide2 />,
        <Slide3 />,
        <Slide4 />,
      ]}
    >

    </OnboardingSlideShow>
  )
}

function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div className="flex flex-col items-center justify-center text-center gap-2" >
        <p className="font-bold text-2xl" >Scouting 101</p>
        <SecondaryText className="font-semibold text-md" >Scouting is a feature in SCRUMMY that allows you to keep your own bookmark list of players you would like to keep an eye, or plan to add to your team in the future</SecondaryText>
      </div>
    </div>
  )
}

function Slide2() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div className="flex flex-col items-center justify-center text-center gap-2" >
        <p className="font-bold text-2xl" >Scouting a Player</p>
        <SecondaryText className="font-semibold text-md" >Inorder to add a player to your scouting list you can click on the "Scout Player" button on their player profile</SecondaryText>
      </div>
    </div>
  )
}

function Slide3() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div className="flex flex-col items-center justify-center text-center gap-2" >
        <p className="font-bold text-2xl" >Accessing your scouting list</p>
        <SecondaryText className="font-semibold text-md" >You can quickly add players from scouting list to your team, by switching to the "Scouting List" view, as you are picking your team.</SecondaryText>
      </div>
    </div>
  )
}

function Slide4() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div className="flex flex-col items-center justify-center text-center gap-2" >
        <p className="font-bold text-2xl" >You are now ready!</p>
        <SecondaryText className="font-semibold text-md" ></SecondaryText>

        <PrimaryButton>Get Started</PrimaryButton>
      </div>
    </div>
  )
}