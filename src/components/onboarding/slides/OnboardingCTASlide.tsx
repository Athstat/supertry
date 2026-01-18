import { useNavigate } from "react-router-dom";
import { analytics } from "../../../services/analytics/anayticsService";
import ScrummyLogo from "../../branding/scrummy_logo";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import SecondaryText from "../../ui/typography/SecondaryText";
import { useInternalUserProfile } from "../../../hooks/auth/useInternalUserProfile";
import { useOnboarding } from "../../../hooks/onboarding/useOnboarding";
import { UpdatedUserInternalProfileReq } from "../../../types/auth";
import { useAuth } from "../../../contexts/AuthContext";

export function OnboardingCTASlide() {

  const navigate = useNavigate();
  const {authUser} = useAuth();

  const {updateProfile, isLoading} = useInternalUserProfile();
  const {favouriteTeams, country} = useOnboarding();

  const handleGetStarted = async () => {

    const data: UpdatedUserInternalProfileReq = {
      country: country?.name,
      completed_onboarding: true,
      favourite_teams: favouriteTeams.map((t) => {
        return {
          user_id: authUser?.kc_id || '',
          team_id: t.team.athstat_id,
          season_id: t.seasonId
        }
      })
    }

    await updateProfile(data);
    analytics.trackOnboardingCtaContinued('/dashboard');
    navigate('/dashboard');
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
            isLoading={isLoading}
            disabled={isLoading}
          >
            Get Started
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
