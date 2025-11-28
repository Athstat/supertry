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

    const { gameKickedOff } = fixtureSummary(fixture);

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

            <div className="flex flex-col gap-4" >

                <div className="flex flex-row gap-1" >
                    <div className="flex flex-1 items-center justify-start" >
                        <TeamLogo className="w-6 h-6" teamName={fixture?.team?.athstat_name} url={fixture?.team?.image_url} />
                    </div>
                    <div className="flex flex-[3] font-semibold items-center justify-center text-center " >
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
    const { homeValue, awayValue, winner, action, hide, homeStrValue, awayStrValue } = stat;
    const homeTeamWonCategory = winner === 'home';
    const awayTeamWonCategory = winner === 'away';

    const total = (homeValue ?? 0) + (awayValue ?? 0);
    const homePerc = (total > 0 ? ((homeValue ?? 0) / (total)) : 0) * 100;
    const awayPerc = (total > 0 ? ((awayValue ?? 0) / (total)) : 0) * 100;

    if (hide) return;

    return (
        <div className="flex flex-col w-full gap-1" >

            <div className="w-full flex flex-row items-center justify-between" >
                <div>
                    <p className="text-sm" >{homeStrValue || homeValue}</p>
                </div>

                <p className="text-sm font-medium" >{action}</p>
                <div>
                    <p className="text-sm" >{awayStrValue || awayValue}</p>
                </div>
            </div>

            <div className="flex flex-row items-center gap-4 justify-between" >

                <div
                    className="flex-1 flex flex-row items-center justify-end rounded-full bg-slate-700 h-[10px]"
                >
                    <div style={{ width: `${homePerc}%` }} className={twMerge(
                        "h-[10px] rounded-full bg-slate-400/60",
                        homeTeamWonCategory && "bg-blue-500"
                    )} />
                </div>

                <div
                    className="flex-1 flex flex-row items-center justify-start rounded-full bg-slate-700 h-[10px]"
                >
                    <div style={{ width: `${awayPerc}%` }} className={twMerge(
                        "h-[10px] rounded-full bg-slate-400/60",
                        awayTeamWonCategory && "bg-blue-500"
                    )} />
                </div>
            </div>

        </div>
    )
}
