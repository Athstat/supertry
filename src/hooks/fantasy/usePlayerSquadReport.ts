import { useMemo } from 'react';
import useSWR from 'swr';
import { fantasyAthleteService } from '../../services/fantasy/fantasyAthleteService';
import { swrFetchKeys } from '../../utils/swrKeys';
import { djangoAthleteService } from '../../services/athletes/djangoAthletesService';
import { checkDaysDiff } from '../../utils/dateUtils';
import { IFixture } from '../../types/games';

export function usePlayerSquadReport(teamId: string | number, trackingId: string) {
  const key = swrFetchKeys.getPlayerSquadReport(teamId, trackingId);
  const {
    data: report,
    isLoading,
    error,
  } = useSWR(key, () => fantasyAthleteService.getRoundSquadReport(teamId, trackingId));

  const isAvailable = report && report.availability === 'AVAILABLE';
  const notAvailable = report && report.availability === 'TEAM_NOT_PLAYING';

  const reportText = useMemo(() => {
    if (report) {
      const { availability, home_team_name, away_team_name, game_id, team_name } = report;

      if (availability === 'AVAILABLE' && game_id) {
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
export function useGeneralPlayerAvailability(athleteId: string) {
  const key = `/athlete/${athleteId}/general-availability`;
  const { data: list, isLoading } = useSWR(key, () => djangoAthleteService.getAthleteAvailabilityReport(athleteId));

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

  return {
    report: firstReport,
    isLoading,
    nextMatch,
    isPending,
    isNotAvailable,
    isTeamNotPlaying
  };
}
