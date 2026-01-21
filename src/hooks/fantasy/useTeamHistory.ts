import { useContext } from "react";
import { TeamHistoryContext } from "../../providers/fantasy_teams/TeamHistoryProvider";


/** 
 * Hook that provides functionality to travel through a teams history.
 * This hook depends on the `FantasyLeagueGroupProvider` and the `TeamHistoryProvider`
*/

export function useTeamHistory() {
    const context = useContext(TeamHistoryContext);

    if (context === null) {
        throw new Error("useTeamHistory() hook was used outside the TeamHistoryProvider");
    }

    return {
        ...context
    }
}