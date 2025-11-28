import { twMerge } from "tailwind-merge"
import { IFixture, ITeamActionName } from "../../../types/games"
import { TeamActionsParser, TeamHeadtoHeadItem } from "../../../utils/teamActionsUtils"
import RoundedCard from "../../shared/RoundedCard"
import TeamLogo from "../../team/TeamLogo"
import useSWR from "swr"
import { gamesService } from "../../../services/gamesService"
import { mapSportsActionToAthstatName } from "../../../utils/sportsActionUtils"
import { fixtureSummary } from "../../../utils/fixtureUtils"

type Props = {
    fixture: IFixture
}

export default function FixtureTeamStats({ fixture }: Props) {

    const fixtureId = fixture.game_id;
    const teamActionsKey = fixtureId ? `fixtures/${fixtureId}/team-actions` : null;
    const { data: teamActions, isLoading } = useSWR(teamActionsKey, () =>
        gamesService.getGameTeamActions(fixtureId ?? '')
    );

    const {gameKickedOff} = fixtureSummary(fixture);

    const formatedTeamActions = (teamActions ?? []).map((t) => {

        return {
            ...t,
            action: mapSportsActionToAthstatName(t.action) as ITeamActionName
        }
    })
    const taParser = new TeamActionsParser(formatedTeamActions, fixture?.team?.athstat_id ?? '', fixture?.opposition_team?.athstat_id ?? '');

    if (isLoading) {
        return (
            <RoundedCard className="p-4" />
        )
    }

    if (!gameKickedOff) {
        return null;
    }

    return (
        <RoundedCard className="p-4 dark:border-none" >

            <div className="flex flex-col gap-2" >

                <div className="flex flex-row gap-1" >
                    <div className="flex flex-1 items-center justify-start" >
                        <TeamLogo className="w-6 h-6" teamName={fixture?.team?.athstat_name} url={fixture?.team?.image_url} />
                    </div>
                    <div className="flex flex-[3] items-center justify-center text-center " >
                        <p>Team Stats</p>
                    </div>
                    <div className="flex flex-1 items-center justify-end" >
                        <TeamLogo className="w-6 h-6" teamName={fixture?.team?.athstat_name} url={fixture?.opposition_team?.image_url} />
                    </div>
                </div>

                <HeadToHeadItem stat={{
                    action: 'Points',
                    homeValue: fixture.team_score,
                    awayValue: fixture.opposition_score,
                    winner: taParser.calculateWinner(fixture.team_score, fixture.opposition_score)
                }} />

                <HeadToHeadItem stat={taParser.getTries()} />
                <HeadToHeadItem stat={taParser.getDropGoalsScored()} />
                <HeadToHeadItem stat={taParser.getConversionsRate()} />
                <HeadToHeadItem stat={taParser.getPenaltyGoalsScored()} />
                <HeadToHeadItem stat={taParser.getPenaltiesConceded()} />
                <HeadToHeadItem stat={taParser.getPassesMade()} />
                <HeadToHeadItem stat={taParser.getScrumsWon()} />
                <HeadToHeadItem stat={taParser.getMaulsFormed()} />
                <HeadToHeadItem stat={taParser.getTurnoversWon()} />
                <HeadToHeadItem stat={taParser.getTurnoversConceded()} />
                <HeadToHeadItem stat={taParser.getTacklesMade()} />
                <HeadToHeadItem stat={taParser.getYellowCards()} />
                <HeadToHeadItem stat={taParser.getRedCards()} />

            </div>
        </RoundedCard>
    )
}


type HeadToHeadProps = {
    stat: TeamHeadtoHeadItem
}

function HeadToHeadItem({ stat }: HeadToHeadProps) {
    const { homeValue, awayValue, winner, action, hide } = stat;
    const homeTeamWonCategory = winner === 'home';
    const awayTeamWonCategory = winner === 'away';

    if (hide) return;

    return (
        <div className="flex flex-row " >

            <div className="flex flex-1 items-center justify-start" >
                <p className={twMerge("h-full rounded-xl w-10 flex flex-col items-center justify-center",
                    homeTeamWonCategory && "bg-blue-700 text-white"
                )} >{homeValue ?? '-'}</p>
            </div>

            <div className="flex flex-[3] items-center justify-center text-center " >
                <p className="text-slate-700 font-medium dark:text-slate-400" >{action}</p>
            </div>

            <div className="flex flex-1  items-center justify-end" >
                <p className={twMerge("h-full rounded-xl w-10 flex flex-col items-center justify-center",
                    awayTeamWonCategory && "bg-blue-700 text-white"
                )} >{awayValue ?? '-'}</p>
            </div>
        </div>
    )
}
