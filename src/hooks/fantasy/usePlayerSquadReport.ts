import { useMemo } from 'react';
import useSWR from 'swr';
import { fantasyAthleteService } from '../../services/fantasy/fantasyAthleteService';
import { swrFetchKeys } from '../../utils/swrKeys';
import { athleteService } from '../../services/athletes/athletesService';
import { checkDaysDiff } from '../../utils/dateUtils';
import { IFixture } from '../../types/fixtures';

export function usePlayerSquadReport(teamId: string | number, trackingId: string) {
  const key = swrFetchKeys.getPlayerSquadReport(teamId, trackingId);
  const {
    data: report,
    isLoading,
    error,
  } = useSWR(key, () => fantasyAthleteService.getRoundSquadReport(teamId, trackingId));

  //console.log('report: ', report);

  //const isAvailable = report && report.availability === 'AVAILABLE';
  const isAvailable =
    report && (report.availability === 'STARTING' || report.availability === 'BENCH');
  const notAvailable =
    report &&
    (report.availability === 'TEAM_NOT_PLAYING' || report.availability === 'NOT_IN_SQUAD');

  const reportText = useMemo(() => {
    if (report) {
      const { availability, home_team_name, away_team_name, game_id, team_name } = report;

      if (availability === 'STARTING' || (availability === 'BENCH' && game_id)) {
        const isHomeTeam = team_name === home_team_name;
        const opponent = isHomeTeam ? away_team_name : home_team_name;
        return `vs ${opponent}`;
      }

      return 'Not Playing ⚠️';
    }

    return undefined;
  }, [report]);

  return {
    isAvailable,
    isLoading,
    report,
    reportText,
    error,
    notAvailable,
  };
}

/** Gets general Player Availability outside rosters */
export function useGeneralPlayerAvailability(athleteId: string, specific_team_id?: string) {

  const key = `/athlete/${athleteId}/general-availability${specific_team_id ? `?specific_team_id=${specific_team_id}` : ''}`;
  const { data: list, isLoading } = useSWR(key, () => athleteService.getAthleteAvailabilityReport(athleteId, specific_team_id));

  const firstReport = useMemo(() => {
    if (list && list?.length > 0) {
      const report = list[0];
      const isOldFixture = report?.game?.kickoff_time && checkDaysDiff(new Date(), report.game.kickoff_time, 2);

      if (!isOldFixture) {
        return report;
      }
    }

    return undefined;
  }, [list]);

  const nextMatch = useMemo<IFixture | undefined>(() => {
    return firstReport?.game;
  }, [firstReport]);

  const isPending = useMemo(() => {
    return firstReport?.status === "PENDING";
  }, [firstReport]);

  const isNotAvailable = useMemo(() => {
    return firstReport?.status === "NOT_AVAILABLE";
  }, [firstReport]);

  const isTeamNotPlaying = useMemo(() => {
    return firstReport?.status === "TEAM_NOT_PLAYING";
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
  }, [nextMatch])

  return {
    report: firstReport,
    isLoading,
    nextMatch,
    isPending,
    isNotAvailable,
    isTeamNotPlaying,
    isPastGame
  };
}