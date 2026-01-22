import ScrummyLogo from "../../../components/branding/scrummy_logo";
import OnboardingSlideShow from "../../../components/onboarding/OnboardingSlideShow";
import PrimaryButton from "../../../components/ui/buttons/PrimaryButton";
import SecondaryText from "../../../components/ui/typography/SecondaryText";
import { useHideBottomNavBar, useHideTopNavBar } from "../../../hooks/navigation/useNavigationBars";
import { useNavigateBack } from "../../../hooks/web/useNavigateBack";
import { SCOUTING_LIST_MAX_SIZE } from "../../../types/constants";

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
        <Slide5 />
      ]}

      preloadImages={[
        "https://dp7xhssw324ru.cloudfront.net/Scouting_Onboarding_Slide_1.png",
        "https://dp7xhssw324ru.cloudfront.net/Scouting_Onboarding_Slide_2.png",
        "https://dp7xhssw324ru.cloudfront.net/Scouting_Onboarding_Slide_3.png",
        "https://dp7xhssw324ru.cloudfront.net/Scouting_Onboarding_Slide_4.png",
      ]}
    >

    </OnboardingSlideShow>
  )
}

function Slide1() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'https://dp7xhssw324ru.cloudfront.net/Scouting_Onboarding_Slide_1.png'} className="rounded-xl" />
      </div>

      <div className="flex flex-col gap-4 items-center justify-center text-center" >
        <p className="font-bold text-2xl" >Scouting 101</p>
        <SecondaryText className="font-semibold text-md" >Scouting allows you to keep a list of players you would like to keep an eye, or plan to add to your team in the future</SecondaryText>
        <SecondaryText className="font-semibold text-md" >You can only scout up to {SCOUTING_LIST_MAX_SIZE} players at a time for each competition, and can access the scouting list from the "Players" tab</SecondaryText>
      </div>
    </div>
  )
}

function Slide2() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'https://dp7xhssw324ru.cloudfront.net/Scouting_Onboarding_Slide_2.png'} className="rounded-xl" />
      </div>

      <div className="flex flex-col items-center justify-center text-center gap-2" >
        <p className="font-bold text-2xl" >Scouting a Player</p>
        <SecondaryText className="font-semibold text-md" >In order to add a player to your scouting list you can click on the "Scout Player" button on their player profile</SecondaryText>
      </div>
    </div>
  )
}

function Slide3() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'https://dp7xhssw324ru.cloudfront.net/Scouting_Onboarding_Slide_3.png'} className="rounded-xl" />
      </div>

      <div className="flex flex-col items-center justify-center text-center gap-2" >
        <p className="font-bold text-2xl" >Accessing your scouting list</p>
        <SecondaryText className="font-semibold text-md" >You can quickly add players from scouting list to your team, by switching to the "Scouting List" view, when picking your team</SecondaryText>
      </div>
    </div>
  )
}

function Slide4() {
  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'https://dp7xhssw324ru.cloudfront.net/Scouting_Onboarding_Slide_4.png'} className="rounded-xl" />
      </div>

      <div className="flex flex-col items-center justify-center text-center gap-2" >
        <p className="font-bold text-2xl" >Stop scouting a player</p>
        <SecondaryText className="font-semibold text-md" >You can remove a player by navigating to your scouting list, selecting the player then clicking on the "Stop Scouting Player" button</SecondaryText>
      </div>
    </div>
  )
}

function Slide5() {

  const {hardPop} = useNavigateBack();
  const handleCTA = () => {

    hardPop('/scouting/my-list')
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4" >
      <ScrummyLogo className="w-32 h-32" />

      <div className="flex flex-col items-center justify-center text-center gap-2" >
        <p className="font-bold text-2xl" >You are now ready!</p>
        <SecondaryText className="font-semibold text-md" ></SecondaryText>

        <PrimaryButton onClick={handleCTA} >Get Started</PrimaryButton>
      </div>
    </div>
  )
}