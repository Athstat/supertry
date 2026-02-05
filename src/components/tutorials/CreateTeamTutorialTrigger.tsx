import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth/AuthContext';
import { useInternalUserProfile } from '../../hooks/auth/useInternalUserProfile';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { useUserRoundTeam } from '../../hooks/fantasy/useUserRoundTeam';
import { isSeasonRoundLocked } from '../../utils/leaguesUtils';
import { useTutorial } from '../../hooks/tutorials/useTutorial';
import { TUTORIAL_IDS } from '../../tutorials/tutorialIds';
import { getTutorialFlags } from '../../utils/tutorials/tutorialStorage';
import { isCreateTeamTutorialEligible } from '../../utils/tutorials/createTeamTutorialEligibility';
import { getCreateTeamTutorialSteps } from '../../tutorials/createTeamTutorial';

export default function CreateTeamTutorialTrigger() {
  const { authUser } = useAuth();
  const { internalProfile, isLoading: loadingProfile } = useInternalUserProfile();
  const { currentRound, nextRound } = useFantasySeasons();
  const { startTutorial, isActive } = useTutorial();
  const location = useLocation();

  const userId = authUser?.kc_id;
  const isLocked = currentRound ? isSeasonRoundLocked(currentRound) : false;
  const eligibleRound = isLocked ? nextRound : currentRound;

  const { roundTeam, isLoading: loadingTeam } = useUserRoundTeam(
    userId,
    eligibleRound?.round_number,
    Boolean(eligibleRound)
  );

  const localStorageFlags = getTutorialFlags(TUTORIAL_IDS.CREATE_TEAM, userId);

  const eligible = isCreateTeamTutorialEligible({
    completedOnboarding: Boolean(internalProfile?.completed_onboarding),
    userId,
    currentRound,
    nextRound,
    hasTeamForEligibleRound: Boolean(roundTeam),
    localStorageFlags,
  });

  useEffect(() => {
    if (loadingProfile || loadingTeam) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const forceTutorial = params.get('tutorial') === TUTORIAL_IDS.CREATE_TEAM;

    if (!eligible && !forceTutorial) {
      return;
    }

    if (isActive(TUTORIAL_IDS.CREATE_TEAM)) {
      return;
    }

    startTutorial(TUTORIAL_IDS.CREATE_TEAM, getCreateTeamTutorialSteps());
  }, [
    eligible,
    isActive,
    location.search,
    loadingProfile,
    loadingTeam,
    startTutorial,
  ]);

  return null;
}
