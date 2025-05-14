import { leagueService } from "../services/leagueService";
import { IFantasyLeague, IFantasyLeagueTeam } from "../types/fantasyLeague";
import { RankedFantasyTeam } from "../types/league";
import { isLeagueLocked } from "../utils/leaguesUtils";
import { useAuthUser } from "./useAuthUser";
import { useFetch } from "./useFetch";

type ResProps = {
    hasCreatedTeam: boolean,
    isTeamCreationLocked: boolean,
    rankedUserTeam?: RankedFantasyTeam,
    userTeam?: IFantasyLeagueTeam,
    isLoading: boolean
}

/** Hook that can be used as a guard for team creation */
export function useTeamCreationGuard(league?: IFantasyLeague) : ResProps {

    const user = useAuthUser();
    const isLocked = isLeagueLocked(league?.join_deadline);

    if (!league) {
        return {
            hasCreatedTeam: false,
            isTeamCreationLocked: isLocked,
            rankedUserTeam: undefined,
            isLoading: false
        };
    }

    const {data, isLoading, error} = useFetch(
        "participating-teams",
        league.id,
        leagueService.fetchParticipatingTeams
    );

    const participatingTeams = data ?? [];
    let rankedUserTeam : RankedFantasyTeam | undefined;
    let userTeam : IFantasyLeagueTeam | undefined;

    participatingTeams
    .sort((a, b) => (b.overall_score ?? 0) - (a.overall_score ?? 0))
    .forEach((t, index) => {
        if (t.kc_id === user.id) {
            rankedUserTeam = {
                userId: t.kc_id,
                teamName: t.name ?? "Unkown Team",
                id: t.id,
                rank: index + 1,
                totalPoints: t.overall_score ?? 0,
                weeklyPoints: t.overall_score ?? 0,
                managerName: t.first_name + " " + t.last_name,
                lastRank: index + 1
            }

            userTeam = t;
        }
    });

    return {
        hasCreatedTeam: userTeam !== undefined,
        rankedUserTeam,
        isTeamCreationLocked: isLocked,
        isLoading: isLoading,
        userTeam
    }
}