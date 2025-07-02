import { Shield } from "lucide-react"
import { IFixture, ITeamAction } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import TeamLogo from "../team/TeamLogo"
import { IBoxScoreItem } from "../../types/boxScore"
import { twMerge } from "tailwind-merge"
import { TeamActionsParser, TeamHeadtoHeadItem } from "../../utils/teamActionsUtils"

type Props = {
    fixture: IFixture,
    boxScore: IBoxScoreItem[],
    teamActions: ITeamAction[]
}


export default function FixtureHeadToHeadStats({ fixture, teamActions }: Props) {

    const taParser = new TeamActionsParser(teamActions, fixture.team_id, fixture.opposition_team_id);

    return (
        <TitledCard title="Head to Head" icon={Shield} >

            <div className="flex flex-col gap-2" >

                <div className="flex flex-row gap-1" >
                    <div className="flex flex-1 items-center justify-start" >
                        <TeamLogo className="w-6 h-6" url={fixture.team_image_url} />
                    </div>
                    <div className="flex flex-[3] items-center justify-center text-center " >
                        <p>Team Stats</p>
                    </div>
                    <div className="flex flex-1 items-center justify-end" >
                        <TeamLogo className="w-6 h-6" url={fixture.opposition_image_url} />
                    </div>
                </div>
            
                <HeadToHeadItem stat={taParser.getTries()} />
                <HeadToHeadItem stat={taParser.getDropGoalsScored()} />
                <HeadToHeadItem stat={taParser.getConversionsRate()} />
                <HeadToHeadItem stat={taParser.getPenaltyGoalsScored()} />
                <HeadToHeadItem stat={taParser.getPenaltiesConceded()} />
                <HeadToHeadItem stat={taParser.getPassesMade()} />
                <HeadToHeadItem stat={taParser.getTurnoversWon()} />
                <HeadToHeadItem stat={taParser.getTurnoversConceded()} />
                <HeadToHeadItem stat={taParser.getTacklesMade()} />

            </div>

            {/* <div className="mt-5" >
                {statsArr.length > 5 && !showMore && <button onClick={toogleShowMore} className="text-blue-400 hover:text-blue-500" >Show more</button>}
                {statsArr.length > 5 && showMore && <button onClick={toogleShowMore} className="text-blue-400 hover:text-blue-500" >Show less</button>}
            </div> */}
        </TitledCard>
    )
}


type HeadToHeadProps = {
    stat: TeamHeadtoHeadItem
}

function HeadToHeadItem ({stat} : HeadToHeadProps) {
    const {homeValue, awayValue, winner, action, hide} = stat;
    const homeTeamWonCategory = winner === 'home';
    const awayTeamWonCategory = winner === 'away';

    if (hide) return;

    return (
        <div className="flex flex-row " >

            <div className="flex flex-1 items-center justify-start" >
                <p className={twMerge("h-full rounded-xl w-10 flex flex-col items-center justify-center",
                    homeTeamWonCategory && "bg-blue-700 text-white"
                )} >{homeValue}</p>
            </div>

            <div className="flex flex-[3] items-center justify-center text-center " >
                <p className="text-slate-700 font-medium dark:text-slate-400" >{action}</p>
            </div>

            <div className="flex flex-1  items-center justify-end" >
                <p className={twMerge("h-full rounded-xl w-10 flex flex-col items-center justify-center",
                    awayTeamWonCategory && "bg-blue-700 text-white"
                )} >{awayValue}</p>
            </div>
        </div>
    )
}