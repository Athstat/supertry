import ScrummyLogo from "../../branding/scrummy_logo";
import SecondaryText from "../../ui/typography/SecondaryText";

export function OnboardingFixturesSlide() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto items-center justify-start">
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'https://dp7xhssw324ru.cloudfront.net/onboarding_3.png'} className="rounded-xl" />
      </div>

      {/* Coins Floating Glowings in Yellow */}
      {/* Cline implement this */}

      <div className="">
        <h1 className="text-lg text-center font-extrabold">Track scores and stats from matches</h1>
      </div>

      <div className="flex flex-col items-center text-center justify-center">
        {/* <p className='font-bold' >Use your SCRUMMY coins to pick your players</p> */}
        <SecondaryText className="text-lg text-center">
          SCRUMMY gives you scores, stats, and in depth player analytics. Never miss a try with our notifications and updates.
        </SecondaryText>
      </div>
    </div>
  );
}