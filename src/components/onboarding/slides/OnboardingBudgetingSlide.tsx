import ScrummyLogo from "../../branding/scrummy_logo";
import SecondaryText from "../../ui/typography/SecondaryText";

export function OnboardingBudgetingSlide() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto items-center justify-start">
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'/images/onboarding/Compare Players.png'} className="rounded-xl" />
      </div>

      {/* Coins Floating Glowings in Yellow */}
      {/* Cline implement this */}

      <div className="">
        <h1 className="text-lg text-center font-extrabold">
          Use your SCRUMMY coins to pick your favorite players!
        </h1>
      </div>

      <div className="flex flex-col items-center text-center justify-center">
        {/* <p className='font-bold' >Use your SCRUMMY coins to pick your players</p> */}
        <SecondaryText className="text-lg text-center">
          You have 240 coins - talent is everywhere, pick the top 6 players to create your Dream
          Team. Use SCRUMMY data to chose carefully!
        </SecondaryText>
      </div>
    </div>
  );
}