import { useCallback, useContext, useMemo } from "react";
import { IAthleteTeam, IProAthlete } from "../../types/athletes";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";
import { SeasonTeamsContext } from "../../contexts/data/SeasonTeamsContext";

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

    const getTeamByName = useCallback((name: string) => {
        return teams.find((t) => {
            return t.athstat_name.toLowerCase() == name.toLowerCase();
        })
    }, [teams]);

    return {
        teams,
        isLoading,
        mutate,
        error,
        getTeamById,
        getAthleteSeasonTeam,
        season: selectedSeason,
        getTeamByName
    }
}


/** Hook that gets an athletes season team */
export function usePlayerSeasonTeam(player?: IProAthlete) {

    const { getAthleteSeasonTeam } = useSeasonTeams();

    const athleteTeams = useMemo(() => {
        return player?.athlete_teams || [];
    }, [player?.athlete_teams]);

    const seasonTeam = getAthleteSeasonTeam(player?.athlete_teams || []) || player?.team;

    const athleteSeasonTeamRecord = useMemo(() => {
        return athleteTeams.find((t) => {
            return t.team_id === seasonTeam?.athstat_id
        });
    }, [athleteTeams, seasonTeam?.athstat_id]);

    return {
        seasonTeam: seasonTeam || player?.team,
        playerImageUrl: athleteSeasonTeamRecord?.player_image_url || player?.image_url
    }
}

