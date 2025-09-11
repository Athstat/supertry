import { useMemo } from "react";
import useSWR from "swr";
import { fantasyAthleteService } from "../../services/fantasy/fantasyAthleteService";
import { swrFetchKeys } from "../../utils/swrKeys";

export function usePlayerSquadReport(teamId: string | number, trackingId: string) {

    const key = swrFetchKeys.getPlayerSquadReport(teamId, trackingId);
    const {data: report, isLoading, error} = useSWR(key, () => fantasyAthleteService.getRoundSquadReport(teamId, trackingId));

    const isAvailable = report && report.availability === "AVAILABLE";
    const notAvailable = report && report.availability === "TEAM_NOT_PLAYING";

    const reportText = useMemo(() => {
        if (report) {
            const {availability, home_team_name, away_team_name, game_id, team_name} = report;

            if (availability === 'AVAILABLE' && game_id) {
                const isHomeTeam = team_name === home_team_name;
                const opponent = isHomeTeam ? away_team_name : home_team_name;
                return `vs ${opponent}`;
            }

            return 'Not Available'
        }

        return undefined;
    }, [report]);


    return {
        isAvailable,
        isLoading,
        report,
        reportText,
        error,
        notAvailable
    }
}