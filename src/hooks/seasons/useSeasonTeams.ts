import { useCallback, useContext } from "react";
import { SeasonTeamsContext } from "../../contexts/SeasonTeamsContext";
import { IAthleteTeam, IProAthlete } from "../../types/athletes";

export function useSeasonTeams() {

    const context = useContext(SeasonTeamsContext);

    if (context === null) {
        throw Error("useSeasonTeams() hook must be mounted inside the SeasonTeamsProvider");
    }

    const {teams, isLoading, refresh: mutate, error, season} = context;

    const getTeamById = useCallback((teamId: string) => {
        return teams.find((t) => t.athstat_id === teamId);
    }, [teams]);

    /** Function that takes an array of an athlete teams and picks up the right team based on the current season */
    const getAthleteSeasonTeam = useCallback((athleteTeams: IAthleteTeam[]) => {
        const athleteSeasonTeam = athleteTeams.find((t) => {
            return t.season_id === season?.id;
        });

        if (athleteSeasonTeam) {
            return getTeamById(athleteSeasonTeam.team_id);
        }

        return undefined;
    }, [getTeamById, season?.id])

    return {
        teams,
        isLoading,
        mutate,
        error,
        getTeamById,
        getAthleteSeasonTeam
    }
}


/** Hook that gets an athletes season team */
export function usePlayerSeasonTeam(player: IProAthlete) {
    const {getAthleteSeasonTeam} = useSeasonTeams();
    const seasonTeam = getAthleteSeasonTeam(player.athlete_teams || []) || player.team;

    return {
        seasonTeam
    }
}