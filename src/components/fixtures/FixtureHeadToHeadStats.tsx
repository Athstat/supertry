import { Shield } from "lucide-react"
import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { useState } from "react"
import TeamLogo from "../team/TeamLogo"
import { aggregateTeamStats } from "../../utils/boxScoreUtils"
import { IBoxScore } from "../../types/boxScore"

type Props = {
    fixture: IFixture,
    boxScore: IBoxScore[]
}


export default function FixtureHeadToHeadStats({ fixture, boxScore }: Props) {

    const homeStats = aggregateTeamStats(fixture.team_id, boxScore)
    const awayStats = aggregateTeamStats(fixture.opposition_team_id, boxScore)

    const statsArr: HeadToHeadStat[] = [
        {
            label: "Points",
            homeValue: fixture.team_score,
            awayValue: fixture.opposition_score
        },

        {
            label: "Tries",
            homeValue: homeStats.tries,
            awayValue: awayStats.tries
        },

        {
            label: "Conversations",
            homeValue: `${homeStats.conversionsScored}/${homeStats.conversionsScored + homeStats.conversionsMissed}`,
            awayValue: `${awayStats.conversionsScored}/${awayStats.conversionsScored + awayStats.conversionsMissed}`
        },

        {
            label: "Penalties Scored",
            homeValue: `${homeStats.penaltiesScored}`,
            awayValue: awayStats.penaltiesScored
        },

        {
            label: "Dop Goals",
            homeValue: homeStats.dropGoalsScored,
            awayValue: awayStats.dropGoalsScored
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
            awayValue: awayStats.lineOutsWon
        },

        // {
        //     label: "Scrums won",
        //     homeValue: 8,
        //     awayValue: 7
        // },

        {
            label: "Turnovers Won",
            homeValue: homeStats.turnoversWon,
            awayValue: awayStats.turnoversWon
        },

        {
            label: "Turnovers Conceded",
            homeValue: homeStats.turnoversConceded,
            awayValue: awayStats.turnoversConceded
        },

        {
            label: "Yellow Cards",
            homeValue: homeStats.yellowCards,
            awayValue: awayStats.yellowCards
        },

        {
            label: "Red Card",
            homeValue: homeStats.redCards,
            awayValue: awayStats.redCards
        }
    ]

    const [showMore, setShowMore] = useState(false);

    const displayLen = showMore === true ? statsArr.length : 4;
    const displayStats = [...statsArr].slice(0, displayLen);

    const toogleShowMore = () => setShowMore(!showMore);

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
                    return <div key={index} className="flex flex-row " >
                        <div className="flex flex-1 items-center justify-start" >
                            {stat.homeValue}
                        </div>
                        <div className="flex flex-[3] items-center justify-center text-center " >
                            <p className="text-slate-700 font-medium dark:text-slate-400" >{stat.label}</p>
                        </div>
                        <div className="flex flex-1 items-center justify-end" >
                            {stat.awayValue}
                        </div>
                    </div>
                })}
            </div>

            <div className="mt-5" >
                {statsArr.length > 5 && !showMore && <button onClick={toogleShowMore} className="text-blue-400 hover:text-blue-500" >Show more</button>}
                {statsArr.length > 5 && showMore && <button onClick={toogleShowMore} className="text-blue-400 hover:text-blue-500" >Show less</button>}
            </div>
        </TitledCard>
    )
}


type HeadToHeadStat = {
    label?: string,
    homeValue?: number | string,
    awayValue?: number | string
}