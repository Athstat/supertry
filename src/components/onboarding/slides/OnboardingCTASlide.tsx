import { useNavigate } from "react-router-dom";
import { analytics } from "../../../services/analytics/anayticsService";
import ScrummyLogo from "../../branding/scrummy_logo";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { useInternalUserProfile } from "../../../hooks/auth/useInternalUserProfile";
import { useOnboarding } from "../../../hooks/onboarding/useOnboarding";
import { UpdatedUserInternalProfileReq } from "../../../types/auth";
import { useAuth } from "../../../contexts/AuthContext";
import InputField from "../../ui/forms/InputField";
import { useEditAccountInfo } from "../../../hooks/auth/useEditAccountInfo";
import ErrorCard from "../../ui/cards/ErrorCard";

export function OnboardingCTASlide() {

  const navigate = useNavigate();
  const { authUser } = useAuth();

  const { updateProfile, isLoading: loadingSaveInternalProfile } = useInternalUserProfile();
  const { favouriteTeams, country } = useOnboarding();

  const {
    userNameError, form, setForm,
    handleSaveChanges, isLoading: loadingSaveUsername,
    error
  } = useEditAccountInfo();

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

    updateProfile(data);

    await handleSaveChanges(() => {
      navigate('/dashboard');
      analytics.trackOnboardingCtaContinued('/dashboard');
    });

  };


  const isLoading = loadingSaveInternalProfile || loadingSaveUsername
  const isDisabled = isLoading || Boolean(userNameError);

  return (
    <div className="relative flex flex-col gap-6 h-full w-full overflow-x-auto items-center">
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 items-center">
        <ScrummyLogo className="w-44 h-44 lg:w-72 lg:h-72" />

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black text-center dark:text-white">
            You are now ready to go!
          </h1>

          {/* <div className="flex flex-col items-center text-center font-semibold text-md">
            <SecondaryText className="text-md">You are now ready to go!</SecondaryText>
          </div> */}
        </div>

        <div className="w-full" >

        </div>

        <div className="flex flex-col items-center gap-3 justify-center w-full">
          <InputField
            label={"What should we call you?"}
            placeholder="Enter a username"
            value={form.username}
            onChange={(s) => {
              setForm({ ...form, username: s ?? "" })
            }}
            className="w-full"
            error={userNameError}
          />
          <PrimaryButton
            onClick={handleGetStarted}
            className=" w-full p-4 h-12 px-10 py-2"
            isLoading={isLoading}
            disabled={isDisabled}
          >
            Get Started
          </PrimaryButton>

          {error && <ErrorCard
            message={error}
            error={"Whoops!"}
          />}
        </div>


      </div>
    </div>
  );
}
