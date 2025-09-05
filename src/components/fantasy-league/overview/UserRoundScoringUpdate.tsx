import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from "../../../types/fantasyLeague"
import RoundedCard from "../../shared/RoundedCard"
import SecondaryText from "../../shared/SecondaryText"

type Props = {
    userTeam: FantasyLeagueTeamWithAthletes,
    leagueRound: IFantasyLeagueRound
}

/** Renders an overview of a players team points! */
export default function UserRoundScoringUpdate({ userTeam, leagueRound }: Props) {
    return (
        <RoundedCard className="border-none p-4" >
            <div>
                <p className="font-semibold text-md" >{leagueRound.title} - Points & Scores</p>
            </div>

            <div className="flex flex-col gap-1" >
                <div className="flex flex-row items-center gap-2 justify-between" >
                    <SecondaryText>Score</SecondaryText>
                    <p className="font-medium" >{userTeam.overall_score || '-'}</p>
                </div>

                <div className="flex flex-row items-center gap-2 justify-between" >
                    <SecondaryText>Rank</SecondaryText>
                    <p className="font-medium" >{userTeam.rank || '-'}</p>
                </div>
            </div>
        </RoundedCard>
    )
}
