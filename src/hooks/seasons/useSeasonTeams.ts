import { useCallback, useContext, useMemo } from "react";
import { SeasonTeamsContext } from "../../contexts/SeasonTeamsContext";
import { IAthleteTeam, IProAthlete } from "../../types/athletes";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";

export function useSeasonTeams() {

    const {selectedSeason} = useFantasySeasons();
    const context = useContext(SeasonTeamsContext);

    if (context === null) {
        throw Error("useSeasonTeams() hook must be mounted inside the SeasonTeamsProvider");
    }

    const { teams, isLoading, refresh: mutate, error } = context;

    const getTeamById = useCallback((teamId: string) => {
        return teams.find((t) => t.athstat_id === teamId);
    }, [teams]);

    const getAthleteSeasonTeam = useCallback((athleteTeams: IAthleteTeam[]) => {
        
        const athleteSeasonTeam = athleteTeams.find((t) => {
            return t.season_id === selectedSeason?.id;
        });

        const sameCompetitionTeam = athleteTeams.find((t) => {

            if (t.team_id === '61552296-5035-5cb3-a375-8950f993045c') {   
                console.log("Comparing ", t.competition_id, "and", selectedSeason?.competition_id)
            }
            
            return t.competition_id === selectedSeason?.competition_id;
        });

        if (athleteSeasonTeam) {
            return getTeamById(athleteSeasonTeam.team_id);
        }

        if (sameCompetitionTeam) {
            return getTeamById(sameCompetitionTeam.team_id);
        }

        return undefined;
    }, [getTeamById, selectedSeason]);

    return {
        teams,
        isLoading,
        mutate,
        error,
        getTeamById,
        getAthleteSeasonTeam,
        season: selectedSeason
    }
}


/** Hook that gets an athletes season team */
export function usePlayerSeasonTeam(player?: IProAthlete) {

    const { getAthleteSeasonTeam } = useSeasonTeams();

    const athleteTeams = useMemo(() => {
        return player?.athlete_teams || [];
    }, [player?.athlete_teams]);

    const seasonTeam = getAthleteSeasonTeam(player?.athlete_teams || []) || player?.team;

    const athleteSeasonTeam = useMemo(() => {
        return athleteTeams.find((t) => {
            return t.team_id === seasonTeam?.athstat_id
        });
    }, [athleteTeams, seasonTeam?.athstat_id]);

    return {
        seasonTeam: seasonTeam || player?.team,
        playerImageUrl: athleteSeasonTeam?.player_image_url || player?.image_url
    }
}