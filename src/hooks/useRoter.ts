import { useLocation, useNavigate } from "react-router-dom";
import { IFantasyLeague, IFantasyLeagueTeam } from "../types/fantasyLeague";
import { RankedFantasyTeam } from "../types/league";

export function useRouter() {
    const navigate = useNavigate();
    const { pathname, state, search, hash } = useLocation();

    return {
        back: () => navigate(-1),
        forward: () => navigate(1),
        reload: () => {
            const currentURL = `${pathname}${search}${hash}`;
            navigate(currentURL, { replace: true, state: state });
        },
        push: (key: string) => navigate(key),
        navigateToMyTeam: (team: IFantasyLeagueTeam, rankedTeam?: RankedFantasyTeam) => {

            navigate(`/my-team/${team.team_id}`, {
                state: {
                    team,
                    teamWithRank: rankedTeam
                },
            });

        },
        navigateToLeagueScreen: (league: IFantasyLeague) => {
            navigate(`/league/${league.official_league_id}`, {
                state: { league },
            });
        }
    }
}