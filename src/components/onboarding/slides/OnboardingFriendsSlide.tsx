import ScrummyLogo from "../../branding/scrummy_logo";
import SecondaryText from "../../ui/typography/SecondaryText";

export function OnboardingFriendsSlide() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto items-center justify-start">
      <ScrummyLogo className="w-32 h-32" />

      <div>
        <img src={'https://dp7xhssw324ru.cloudfront.net/onboarding_2.png'} className="rounded-xl" />
      </div>

      {/* Coins Floating Glowings in Yellow */}
      {/* Cline implement this */}

      <div className="">
        <h1 className="text-lg text-center font-extrabold">Rally Your Friends</h1>
      </div>

      <div className="flex flex-col items-center text-center justify-center">
        {/* <p className='font-bold' >Use your SCRUMMY coins to pick your players</p> */}
        <SecondaryText className="text-lg text-center">
          Create your own league, invite friends, and compete for bragging rights. SCRUMMY has
          in-depth player analytics, live updates, and everything you need for fantasy rugby
        </SecondaryText>
      </div>
    </div>
  );
}