import { useMemo } from "react";
import useSWR from "swr";
import { djangoAthleteService } from "../../services/athletes/djangoAthletesService";
import { IFixture } from "../../types/games";

/** Gets Player Specific Round Availability outside rosters */
export function usePlayerRoundAvailability(athleteId: string, seasonId: string, roundNumber: number) {

  const shouldFetch = (Boolean(athleteId) && Boolean(seasonId)) && (roundNumber > 0);
  const key = shouldFetch ? `/athlete/${athleteId}/general-availabilityby-season/${seasonId}/${roundNumber}` : null;

  const { data, isLoading } = useSWR(key, () => djangoAthleteService.getRoundAvailabilityReport(
    athleteId,
    seasonId,
    roundNumber
  ));

  const firstReport = useMemo(() => {
    return data;
  }, [data]);

  const nextMatch = useMemo<IFixture | undefined>(() => {
    return firstReport?.game;
  }, [firstReport]);

  const isPending = useMemo(() => {
    return firstReport?.status === "PENDING";
  }, [firstReport]);

  const isNotAvailable = useMemo(() => {
    return firstReport?.status === "NOT_AVAILABLE";
  }, [firstReport]);

  const isGameTooFarAway = useMemo(() => {
    if (nextMatch) {
      const dateNow = new Date();
      const { kickoff_time } = nextMatch;

      if (kickoff_time) {
        const timeGap = 1000 * 60 * 60 * 24 * 10;
        const adjustedKickoff = new Date(kickoff_time).valueOf() - timeGap
        return dateNow.valueOf() < adjustedKickoff;
      }
    }

    return false;
  }, [nextMatch]);

  const isTeamNotPlaying = useMemo(() => {
    return firstReport?.status === "TEAM_NOT_PLAYING";
  }, [firstReport?.status]);

  const isAvailable = useMemo(() => {
    return firstReport?.status === "AVAILABLE";
  }, [firstReport]);

  const isPastGame = useMemo<boolean>(() => {
    if (nextMatch) {
      const dateNow = new Date();
      const { kickoff_time } = nextMatch;

      if (kickoff_time) {
        const gameHours = 1000 * 60 * 60 * 3;
        const gameAvgEnd = dateNow.valueOf() - gameHours;

        return gameAvgEnd > new Date(kickoff_time).valueOf();
      }
    }

    return false;
  }, [nextMatch]);



  return {
    report: firstReport,
    isLoading,
    nextMatch,
    isPending,
    isNotAvailable,
    isTeamNotPlaying,
    isPastGame,
    isAvailable,
    isGameTooFarAway
  };
}
