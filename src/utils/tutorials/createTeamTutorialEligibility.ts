import { ISeasonRound } from '../../types/fantasy/fantasySeason';
import { isSeasonRoundLocked } from '../leaguesUtils';

type LocalStorageFlags = {
  done?: boolean;
  skipped?: boolean;
};

type EligibilityParams = {
  completedOnboarding: boolean;
  userId?: string;
  currentRound?: ISeasonRound;
  nextRound?: ISeasonRound;
  hasTeamForEligibleRound: boolean;
  localStorageFlags: LocalStorageFlags;
};

export function isCreateTeamTutorialEligible({
  completedOnboarding,
  userId,
  currentRound,
  nextRound,
  hasTeamForEligibleRound,
  localStorageFlags,
}: EligibilityParams) {
  if (!completedOnboarding || !userId) {
    return false;
  }

  if (localStorageFlags.done || localStorageFlags.skipped) {
    return false;
  }

  if (!currentRound) {
    return false;
  }

  const isLocked = isSeasonRoundLocked(currentRound);

  if (!isLocked) {
    return !hasTeamForEligibleRound;
  }

  if (isLocked && nextRound) {
    return !hasTeamForEligibleRound;
  }

  return false;
}
