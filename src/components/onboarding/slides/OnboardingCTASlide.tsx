import { useNavigate } from "react-router-dom";
import { analytics } from "../../../services/analytics/anayticsService";
import ScrummyLogo from "../../branding/scrummy_logo";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import SecondaryText from "../../ui/typography/SecondaryText";

export function OnboardingCTASlide() {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    const nextUrl = '/dashboard';
    analytics.trackOnboardingCtaContinued(nextUrl);
    navigate(nextUrl);
  };

  return (
    <div className="relative flex flex-col gap-6 h-full w-full overflow-x-auto items-center">
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 items-center">
        <ScrummyLogo className="w-44 h-44 lg:w-72 lg:h-72" />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black text-center dark:text-white">
            Bootcamp completed!
          </h1>

          <div className="flex flex-col items-center text-center font-semibold text-md">
            <SecondaryText className="text-md">You are now ready to go!</SecondaryText>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <PrimaryButton
            onClick={handleGetStarted}
            className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
          >
            Get Started
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
