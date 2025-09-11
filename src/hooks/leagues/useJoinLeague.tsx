import { useState } from "react";
import { fantasyLeagueGroupsService } from "../../services/fantasy/fantasyLeagueGroupsService";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";
import { useNavigate } from "react-router-dom";
import { fantasyAnalytics } from "../../services/analytics/fantasyAnalytics";

/** Hook that provides a function to a league */
export function useJoinLeague() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const navigate = useNavigate()

    const handleJoinLeague = async (league: FantasyLeagueGroup, nextUrl?: string) => {

        setLoading(true);

        try {

            const res = await fantasyLeagueGroupsService.joinLeague(
                league.id,
                league.entry_code ?? ""
            );

            if (res.data) {

                fantasyAnalytics.trackJoinedLeagueByCode(league.id);

                if (nextUrl) {
                    navigate(nextUrl, {
                        state: {
                            reloadApp: true
                        }
                    });
                    return;
                }
                window.location.reload();
                setLoading(false);
            } else {
                setError(res.error?.message);
                setLoading(false);
            }


        } catch (err) {
            console.log("Error joining the league ", err);
            setError("Something wen't wrong joining league");
        }

        setLoading(false);
    }

    const clearError = () => {
        setError(undefined)
    }

    return {
        isLoading,
        error,
        handleJoinLeague,
        clearError
    }
}