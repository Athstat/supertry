import ScrummyLogo from "../../branding/scrummy_logo";
import SecondaryText from "../../ui/typography/SecondaryText";

export function OnboardingWelcomeSlide() {
  return (
    <div className="flex flex-col gap-4 h-full overflow-y-auto items-center justify-start">
      <ScrummyLogo className="w-52 h-52" />

      <div className="">
        <h1 className="text-2xl text-center font-extrabold dark:text-white">
          Let's get you warmed up to join the SCRUM!
        </h1>
      </div>

      <div className="flex flex-col items-center text-center justify-center">
        {/* <p className='font-bold' >Use your SCRUMMY coins to pick your players</p> */}
        <SecondaryText className="text-lg text-center">
          {/* You have 240 coins - talent is everywhere if you look closely and lots of data to analyse to chose your Dream Team */}
          Don't worry, it's less bruises and more bragging rights from here
        </SecondaryText>
      </div>
    </div>
  );
}