import { Shield } from "lucide-react"
import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { useState } from "react"
import TeamLogo from "../team/TeamLogo"

type Props = {
    fixture: IFixture
}


export default function FixtureHeadToHeadStats({ fixture }: Props) {

    const statsArr: HeadToHeadStat[] = [
        {
            label: "Points",
            homeValue: fixture.team_score,
            awayValue: fixture.opposition_score
        },

        {
            label: "Tries",
            homeValue: 3,
            awayValue: 5
        },

        {
            label: "Conversations",
            homeValue: "3/4",
            awayValue: "2/3"
        },

        {
            label: "Penalties",
            homeValue: "2/2",
            awayValue: "3/4"
        },

        {
            label: "Dop Goals",
            homeValue: 1,
            awayValue: 2
        },

        {
            label: "Total Kicks at Goal",
            homeValue: 5,
            awayValue: 6
        },

        {
            label: "Tries",
            homeValue: 3,
            awayValue: 5
        },

        {
            label: "Ricks Won",
            homeValue: 10,
            awayValue: 15
        },

        {
            label: "Lineouts Won",
            homeValue: 13,
            awayValue: 15
        },

        {
            label: "Scrums won",
            homeValue: 8,
            awayValue: 7
        },

        {
            label: "Turnovers Won",
            homeValue: 4,
            awayValue: 3
        },

        {
            label: "Turnovers Conceded",
            homeValue: 3,
            awayValue: 6
        },

        {
            label: "Possesion %",
            homeValue: "60%",
            awayValue: "40%"
        },

        {
            label: "Territory %",
            homeValue: "55%",
            awayValue: "45%"
        },

        {
            label: "Yellow Cards",
            homeValue: 0,
            awayValue: 1
        },

        {
            label: "Red Card",
            homeValue: 0,
            awayValue: 1
        }
    ]

    const [showMore, setShowMore] = useState(false);

    const displayLen = showMore === true ? statsArr.length : 4;
    const displayStats = [...statsArr].slice(0, displayLen);

    const toogleShowMore = () => setShowMore(!showMore);

    return (
        <TitledCard title="Head to Head" icon={Shield} >

            <div className="flex flex-col" >

                <div className="flex flex-row gap-1" >
                    <div className="flex flex-1 items-center justify-start" >
                        <TeamLogo className="w-10 h-10" url={fixture.team_image_url} />
                    </div>
                    <div className="flex flex-[3] items-center justify-center text-center " >
                        <p>Stat</p>
                    </div>
                    <div className="flex flex-1 items-center justify-end" >
                        <TeamLogo className="w-10 h-10" url={fixture.opposition_image_url} />
                    </div>
                </div>

                {displayStats.map((stat, index) => {
                    return <div key={index} className="flex flex-row " >
                        <div className="flex flex-1 items-center justify-start" >
                            {stat.homeValue}
                        </div>
                        <div className="flex flex-[3] items-center justify-center text-center " >
                            <p className="text-slate-400" >{stat.label}</p>
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