import { useCallback, useContext, useMemo } from "react";
import { SeasonTeamsContext } from "../../contexts/SeasonTeamsContext";
import { IAthleteTeam, IProAthlete } from "../../types/athletes";

export function useSeasonTeams() {

    const context = useContext(SeasonTeamsContext);

    if (context === null) {
        throw Error("useSeasonTeams() hook must be mounted inside the SeasonTeamsProvider");
    }

    const { teams, isLoading, refresh: mutate, error, season } = context;

    const getTeamById = useCallback((teamId: string) => {
        return teams.find((t) => t.athstat_id === teamId);
    }, [teams]);

    

    /** Function that takes an array of an athlete teams and picks up the right team based on the current season */
    const getAthleteSeasonTeam = useCallback((athleteTeams: IAthleteTeam[]) => {
        const athleteSeasonTeam = athleteTeams.find((t) => {
            return t.season_id === season?.id;
        });

        const sameCompetitionTeam = athleteTeams.find((a) => {
            return (season?.competition_id)?.toString() === (a.competition_id)?.toString();
        });

        if (athleteSeasonTeam) {
            return getTeamById(athleteSeasonTeam.team_id);
        }

        if (sameCompetitionTeam) {
            return getTeamById(sameCompetitionTeam.team_id);
        }

        return undefined;
    }, [getTeamById, season]);

    return {
        teams,
        isLoading,
        mutate,
        error,
        getTeamById,
        getAthleteSeasonTeam,
        season
    }
}


/** Hook that gets an athletes season team */
export function usePlayerSeasonTeam(player?: IProAthlete) {
    const { getAthleteSeasonTeam, season } = useSeasonTeams();
    const seasonTeam = getAthleteSeasonTeam(player?.athlete_teams || []) || player?.team;

    const athleteTeams = useMemo(() => {
        return player?.athlete_teams || [];
    }, [player?.athlete_teams]);

    const athleteSeasonTeam = useMemo(() => {
        return athleteTeams.find((t) => {
            return t.season_id === season?.id;
        });
    }, [athleteTeams, season?.id]);

    return {
        seasonTeam: seasonTeam || player?.team,
        playerImageUrl: athleteSeasonTeam?.player_image_url || player?.image_url
    }
}