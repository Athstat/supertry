import { useMemo } from "react";
import useSWR from "swr";
import { athleteService } from "../../services/athletes/athletesService";
import { IFixture } from "../../types/games";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";

/** Gets Player Specific Round Availability outside rosters */
export function usePlayerRoundAvailability(athleteId: string, seasonId: string, roundNumber: number, team_id?: string, shouldFetch: boolean = true) {

  const { selectedSeason } = useFantasySeasons();
  const finalSeasonId = selectedSeason?.id || seasonId;

  const shouldFetchFinal = (Boolean(athleteId) && Boolean(finalSeasonId)) && (roundNumber > 0) && shouldFetch;
  const key = shouldFetchFinal ? `/athlete/${athleteId}/general-availability/by-season/${finalSeasonId}/${roundNumber}${team_id ? `?team_id=${team_id}` : ''}` : null;

  const { data, isLoading } = useSWR(key, () => athleteService.getRoundAvailabilityReport(
    athleteId,
    finalSeasonId,
    roundNumber,
    team_id
  ), {revalidateIfStale: true});

  const firstReport = data;

  const nextMatch = useMemo<IFixture | undefined>(() => {
    return firstReport?.game;
  }, [firstReport]);

  const isPending = useMemo(() => {
    return firstReport?.status === "PENDING";
  }, [firstReport]);

  const isNotAvailable = useMemo(() => {
    return firstReport?.status === "NOT_AVAILABLE" && !isPending;
  }, [firstReport?.status, isPending]);

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

  const isNotInSeasonSquad = useMemo(() => {
    return firstReport?.status === "NOT_IN_SEASON_SQUAD"
  }, [firstReport?.status])

  const isInjured = useMemo(() => {
    return firstReport?.status === "INJURED"
  }, [firstReport?.status])

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

  const showAvailabilityWarning = (isTeamNotPlaying || isInjured || isNotInSeasonSquad || isNotAvailable) && !isLoading

  const [homeOrAway, opponent] = useMemo(() => {

    if (!nextMatch) {
      return [undefined, undefined];
    }

    const playerTeamId = team_id;

    if (playerTeamId === nextMatch.team?.athstat_id) {
      return ["(H)", nextMatch.opposition_team];
    }

    if (playerTeamId === nextMatch.opposition_team?.athstat_id) {
      return ["(A)", nextMatch.team];
    }

    return [undefined, undefined];

  }, [nextMatch, team_id]);

  const reportTitle = useMemo(() => {
    if (isNotAvailable) {
      return "Not Playing"
    }

    if (isTeamNotPlaying) {
      return "Team Not Playing"
    }

    if (isNotInSeasonSquad) {
      return "Not Playing"
    }

    if (isInjured) {
      return "Injured"
    }
  }, [isInjured, isNotAvailable, isNotInSeasonSquad, isTeamNotPlaying])

  return {
    report: firstReport,
    isLoading,
    nextMatch,
    isPending,
    isNotAvailable,
    isTeamNotPlaying,
    isPastGame,
    isAvailable,
    isGameTooFarAway,
    isNotInSeasonSquad,
    isInjured,
    showAvailabilityWarning,
    homeOrAway,
    opponent,
    reportTitle
  };
}