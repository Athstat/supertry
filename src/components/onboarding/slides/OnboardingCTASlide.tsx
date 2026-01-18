import { useNavigate } from "react-router-dom";
import { useJoinLeague } from "../../../hooks/leagues/useJoinLeague";
import { useOnboarding } from "../../../hooks/onboarding/useOnboarding";
import { analytics } from "../../../services/analytics/anayticsService";
import ScrummyLogo from "../../branding/scrummy_logo";
import { PlayerGameCard } from "../../player/PlayerGameCard";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { Toast } from "../../ui/Toast";
import SecondaryText from "../../ui/typography/SecondaryText";

export function OnboardingCTASlide() {
  const { featuredLeague, featuredPlayers } = useOnboarding();
  const navigate = useNavigate();

  const { isLoading: isJoining, handleJoinLeague, error, clearError } = useJoinLeague();

  const handleStartBuilding = async () => {
    if (featuredLeague) {
      const nextUrl = `/league/${featuredLeague.id}?journey=team-creation`;
      analytics.trackOnboardingCtaContinued(nextUrl);
      await handleJoinLeague(featuredLeague, nextUrl);
    } else {
      const nextUrl = '/leagues?active_tab=discover';
      analytics.trackOnboardingCtaContinued(nextUrl);
      navigate(nextUrl);
    }
  };

  const handleLookAround = () => {
    analytics.trackOnboardingSkipped();
    navigate('/dashboard');
  };

  const top2Players = [...featuredPlayers].slice(0, 2);

  return (
    <div className="relative flex flex-col gap-6 h-full w-full overflow-x-auto items-center">
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-6 items-center">
        <ScrummyLogo className="w-44 h-44 lg:w-72 lg:h-72" />

        <div className="grid grid-cols-2 gap-2">
          {top2Players
            .map(a => {
              return (
                <PlayerGameCard
                  player={a}
                  frameClassName=""
                  detailsClassName=""
                  hideTeamLogo
                  hidePrice
                  key={a.tracking_id}
                />
              );
            })}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black text-center dark:text-white">
            The URC Challenge Is Here!
          </h1>

          <div className="flex flex-col items-center text-center font-semibold text-md">
            <SecondaryText className="text-md">You are now ready to go!</SecondaryText>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <PrimaryButton
            onClick={handleStartBuilding}
            isLoading={isJoining}
            disabled={isJoining}
            className="rounded-3xl w-fit p-4 h-10 w-22 px-10 py-2"
          >
            Start Picking Your Team
          </PrimaryButton>

          <button
            onClick={handleLookAround}
            disabled={isJoining}
            className="rounded-3xl text-slate-700 dark:text-slate-200 w-fit p-4 h-10 w-22 px-10 py-2"
          >
            Look Around First
          </button>
        </div>

        {error && (
          <Toast
            message={error}
            onClose={clearError}
            duration={3000}
            isVisible={error !== undefined}
            type="error"
          />
        )}
      </div>
    </div>
  );
}
