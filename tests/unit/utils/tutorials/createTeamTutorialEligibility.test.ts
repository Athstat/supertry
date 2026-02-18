import { isCreateTeamTutorialEligible } from '../../../../src/utils/tutorials/createTeamTutorialEligibility';
import { ISeasonRound } from '../../../../src/types/fantasy/fantasySeason';

describe('isCreateTeamTutorialEligible', () => {
  const baseParams = {
    completedOnboarding: true,
    userId: 'user-1',
    hasTeamForEligibleRound: false,
    localStorageFlags: { done: false, skipped: false },
  };

  it('returns false if onboarding not completed', () => {
    const currentRound = buildRoundHoursFromNow(2);
    const eligible = isCreateTeamTutorialEligible({
      ...baseParams,
      completedOnboarding: false,
      currentRound,
    });

    expect(eligible).toBe(false);
  });

  it('returns false if already done or skipped', () => {
    const currentRound = buildRoundHoursFromNow(2);
    const eligible = isCreateTeamTutorialEligible({
      ...baseParams,
      currentRound,
      localStorageFlags: { done: true, skipped: false },
    });

    expect(eligible).toBe(false);
  });

  it('returns true when current round is open and user has no team', () => {
    const currentRound = buildRoundHoursFromNow(2);
    const eligible = isCreateTeamTutorialEligible({
      ...baseParams,
      currentRound,
      nextRound: buildRoundHoursFromNow(26),
    });

    expect(eligible).toBe(true);
  });

  it('returns false when current round is open but user already has team', () => {
    const currentRound = buildRoundHoursFromNow(2);
    const eligible = isCreateTeamTutorialEligible({
      ...baseParams,
      currentRound,
      hasTeamForEligibleRound: true,
    });

    expect(eligible).toBe(false);
  });

  it('returns true when current round locked, next round exists, and no team for next round', () => {
    const currentRound = buildRoundHoursFromNow(-2);
    const nextRound = buildRoundHoursFromNow(26);
    const eligible = isCreateTeamTutorialEligible({
      ...baseParams,
      currentRound,
      nextRound,
    });

    expect(eligible).toBe(true);
  });

  it('returns false when current round locked and no next round', () => {
    const currentRound = buildRoundHoursFromNow(-2);
    const eligible = isCreateTeamTutorialEligible({
      ...baseParams,
      currentRound,
    });

    expect(eligible).toBe(false);
  });
});

function buildRoundHoursFromNow(offsetHours: number): ISeasonRound {
  const gamesStart = new Date(Date.now() + offsetHours * 60 * 60 * 1000);

  return {
    id: 'round-1',
    games_start: gamesStart,
    games_end: gamesStart,
    build_up_start: gamesStart,
    coverage_end: gamesStart,
    created_at: gamesStart,
    round_number: 1,
    round_title: 'Round 1',
    season: 'Season',
  } as ISeasonRound;
}
