import { Shield } from "lucide-react"
import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { useState } from "react"

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
            <table className="w-full" >
                <thead className="bg-gray-100 text-slate-600 dark:text-white  dark:bg-gray-700/20" >
                    <tr >
                        <th>Stat</th>
                        <th>{fixture.home_team}</th>
                        <th>{fixture.away_team}</th>
                    </tr>
                </thead>

                <tbody>

                    {displayStats.map((stat, index) => {
                        return <tr className="dark:hover:bg-slate-800/50 hover:bg-slate-100" key={index} >
                            <td>{stat.label}</td>
                            <td>{stat.homeValue}</td>
                            <td>{stat.awayValue}</td>
                        </tr>

                    })}

                </tbody>
            </table>

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