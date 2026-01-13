import { useContext } from "react";
import { SeasonTeamsContext } from "../../contexts/SeasonTeamsContext";

export function useSeasonTeams() {
    const context = useContext(SeasonTeamsContext);

    if (context === null) {
        throw Error("useSeasonTeams() hook must be mounted inside the SeasonTeamsProvider");
    }

    const {teams, isLoading, refresh: mutate, error} = context;

    return {
        teams,
        isLoading,
        mutate,
        error
    }
}