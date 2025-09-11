import useSWR from "swr"
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from "../../../types/fantasyLeague"
import RoundedCard from "../../shared/RoundedCard"
import SecondaryText from "../../shared/SecondaryText"
import { swrFetchKeys } from "../../../utils/swrKeys"
import { leagueService } from "../../../services/leagueService"
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup"
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils"

type Props = {
    userTeam: FantasyLeagueTeamWithAthletes,
    leagueRound: IFantasyLeagueRound
}

/** Renders an overview of a players team points! */
export default function UserRoundScoringUpdate({ userTeam, leagueRound }: Props) {

    // Lets fetch round scoring analysis
    const key = swrFetchKeys.getLeagueRoundScoringOverview(leagueRound.id);
    const { data: scoringOverview, isLoading } = useSWR(key, () => leagueService.getRoundScoringOverview(leagueRound.id));
    const isLocked = isLeagueRoundLocked(leagueRound);

    if (isLoading) {
        return (
            <RoundedCard className="w-full h-[100px] animate-pulse border-none opacity-75">

            </RoundedCard>
        )
    }

    const highestPointsScored = scoringOverview?.average_points_scored;
    const averagePointsScored = scoringOverview?.average_points_scored;
    const userScore = scoringOverview?.user_score;

    if (!isLocked) return;

    return (
        <RoundedCard className="border-none p-4" >
            <div>
                <p className="font-semibold text-md" >{leagueRound.title} - Ranking & Scoring</p>
            </div>

            <div className="flex flex-col gap-0" >

                { (highestPointsScored ?? 0) > 0 && <div className="flex flex-row items-center gap-2 justify-between" >
                    <SecondaryText>Highest Points Scored</SecondaryText>
                    <p className="font-medium" >{highestPointsScored ? (Math.floor(highestPointsScored)) : '-'}</p>
                </div>}

                {(averagePointsScored ?? 0) > 0 && <div className="flex flex-row items-center gap-2 justify-between" >
                    <SecondaryText>Average Points Scored</SecondaryText>
                    <p className="font-medium" >{averagePointsScored ? (Math.floor(averagePointsScored)) : '-'}</p>
                </div>}

                <div className="flex flex-row items-center gap-2 justify-between" >
                    <SecondaryText>My Score</SecondaryText>
                    <p className="font-medium" >{userScore ? (Math.floor(userScore)) : '-'}</p>
                </div>

                <div className="flex flex-row items-center gap-2 justify-between" >
                    <SecondaryText>My Rank</SecondaryText>
                    <p className="font-medium" >{userTeam.rank ? Math.floor(userTeam.rank) : '-'}</p>
                </div>
            </div>
        </RoundedCard>
    )
}
