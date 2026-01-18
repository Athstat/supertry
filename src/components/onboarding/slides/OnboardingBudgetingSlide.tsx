import ScrummyLogo from "../../branding/scrummy_logo";
import SecondaryText from "../../ui/typography/SecondaryText";

export function OnboardingMyTeamSlide() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto items-center justify-start">
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'https://dp7xhssw324ru.cloudfront.net/onboarding_1.png'} className="rounded-xl" />
      </div>

      {/* Coins Floating Glowings in Yellow */}
      {/* Cline implement this */}

      <div className="">
        <h1 className="text-lg text-center font-extrabold">
          Build your dream fantasy squad of 6 players
        </h1>
      </div>

      <div className="flex flex-col items-center text-center justify-center">
        {/* <p className='font-bold' >Use your SCRUMMY coins to pick your players</p> */}
        <SecondaryText className="text-lg text-center">
          You have 240 coins - talent is everywhere - pick your top 6 players from each position group to create a "Dream Team." Use SCRUMMY's data to choose carefully!
        </SecondaryText>
      </div>
    </div>
  );
}