import { Shield } from "lucide-react"
import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import TeamLogo from "../team/TeamLogo"
import { aggregateTeamStats, convertionsPercVal, convertionsStr } from "../../utils/boxScoreUtils"
import { IBoxScoreItem } from "../../types/boxScore"
import { twMerge } from "tailwind-merge"

type Props = {
    fixture: IFixture,
    boxScore: IBoxScoreItem[]
}


export default function FixtureHeadToHeadStats({ fixture, boxScore }: Props) {

    const homeStats = aggregateTeamStats(fixture.team_id, boxScore)
    const awayStats = aggregateTeamStats(fixture.opposition_team_id, boxScore);

    const statsArr: HeadToHeadStat[] = [
        {
            label: "Points",
            homeValue: fixture.team_score,
            awayValue: fixture.opposition_score,
            homeRealVal: fixture.team_score,
            awayRealVal: fixture.opposition_score
        },

        {
            label: "Tries",
            homeValue: homeStats.tries,
            awayValue: awayStats.tries,
            homeRealVal: homeStats.tries,
            awayRealVal: awayStats.tries,
        },

        {
            label: "Convertions",
            homeValue: convertionsStr(homeStats.convertionsScored, homeStats.convertionsMissed),
            awayValue: convertionsStr(awayStats.convertionsScored, awayStats.convertionsMissed),
            homeRealVal: convertionsPercVal(homeStats.convertionsScored, homeStats.convertionsMissed),
            awayRealVal: convertionsPercVal(awayStats.convertionsScored, awayStats.convertionsMissed)
        },

        {
            label: "Penalties Scored",
            homeValue: homeStats.penaltiesScored,
            awayValue: awayStats.penaltiesScored,
            homeRealVal: homeStats.penaltiesScored,
            awayRealVal: awayStats.penaltiesScored
        },

        {
            label: "Drop Goals",
            homeValue: homeStats.dropGoalsScored,
            awayValue: awayStats.dropGoalsScored,
            homeRealVal: homeStats.dropGoalsScored,
            awayRealVal: awayStats.dropGoalsScored
        },

        // {
        //     label: "Total Kicks at Goal",
        //     homeValue: homeStats.kicksAtGoal,
        //     awayValue: awayStats.kicksAtGoal
        // },

        // {
        //     label: "Rucks Won",
        //     homeValue: homeStats.,
        //     awayValue: 15
        // },

        {
            label: "Lineouts Won",
            homeValue: homeStats.lineOutsWon,
            awayValue: awayStats.lineOutsWon,
            homeRealVal: homeStats.lineOutsWon,
            awayRealVal: awayStats.lineOutsWon
        },

        // {
        //     label: "Scrums won",
        //     homeValue: 8,
        //     awayValue: 7
        // },

        {
            label: "Turnovers Won",
            homeValue: homeStats.turnoversWon,
            awayValue: awayStats.turnoversWon,
            homeRealVal: homeStats.turnoversWon,
            awayRealVal: awayStats.turnoversWon
        },

        {
            label: "Turnovers Conceded",
            homeValue: homeStats.turnoversConceded,
            awayValue: awayStats.turnoversConceded,
            homeRealVal: homeStats.turnoversConceded,
            awayRealVal: awayStats.turnoversConceded
        },

        {
            label: "Yellow Cards",
            homeValue: homeStats.yellowCards,
            awayValue: awayStats.yellowCards,
            homeRealVal: homeStats.yellowCards,
            awayRealVal: awayStats.yellowCards,
        },

        {
            label: "Red Card",
            homeValue: homeStats.redCards,
            awayValue: awayStats.redCards,
            homeRealVal: homeStats.redCards,
            awayRealVal: awayStats.redCards
        }

    ]

    const displayStats = statsArr;

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

                {displayStats.map((stat, index) => {
                    return <HeadToHeadItem stat={stat} key={index} />
                })}
            </div>

            {/* <div className="mt-5" >
                {statsArr.length > 5 && !showMore && <button onClick={toogleShowMore} className="text-blue-400 hover:text-blue-500" >Show more</button>}
                {statsArr.length > 5 && showMore && <button onClick={toogleShowMore} className="text-blue-400 hover:text-blue-500" >Show less</button>}
            </div> */}
        </TitledCard>
    )
}


type HeadToHeadStat = {
    label?: string,
    homeValue?: number | string,
    awayValue?: number | string,
    homeRealVal?: number,
    awayRealVal?: number,
    badStat?: boolean
}

type HeadToHeadProps = {
    stat: HeadToHeadStat
}

function HeadToHeadItem ({stat} : HeadToHeadProps) {
    const {homeRealVal, awayRealVal} = stat;

    const statsNotNull = homeRealVal !== undefined && awayRealVal !== undefined;
    const homeTeamWonCategory = statsNotNull && (homeRealVal > awayRealVal);
    const awayTeamWonCategory = statsNotNull && (homeRealVal < awayRealVal);

    return (
        <div className="flex flex-row " >

            <div className="flex flex-1 items-center justify-start" >
                <p className={twMerge("h-full rounded-xl w-10 flex flex-col items-center justify-center",
                    homeTeamWonCategory && "bg-blue-700 text-white"
                )} >{stat.homeValue}</p>
            </div>

            <div className="flex flex-[3] items-center justify-center text-center " >
                <p className="text-slate-700 font-medium dark:text-slate-400" >{stat.label}</p>
            </div>

            <div className="flex flex-1  items-center justify-end" >
                <p className={twMerge("h-full rounded-xl w-10 flex flex-col items-center justify-center",
                    awayTeamWonCategory && "bg-blue-700 text-white"
                )} >{stat.awayValue}</p>
            </div>
        </div>
    )
}