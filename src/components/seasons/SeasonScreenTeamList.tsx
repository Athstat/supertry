import { Shield } from "lucide-react"
import { ITeam } from "../../types/fixtures"
import ProTeamCard from "../teams/TeamCard"
import NoContentCard from "../ui/typography/NoContentMessage"

type Props = {
    teams: ITeam[]
}

/** renders out a list of teams */
export default function SeasonScreenTeamList({ teams }: Props) {


    return (
        <>
            <div className="flex flex-row items-center gap-2" >
                <Shield />
                <h1 className="text-lg font-bold" >Teams</h1>
            </div>

            <div className="flex flex-row items-center gap-2 overflow-x-auto h-28" >
                {teams.map((t, index) => {
                    return <ProTeamCard className="flex-1 min-w-36 h-full" team={t} key={index} />
                })}
            </div>

            {teams.length === 0 && (
                <NoContentCard 
                    message="No teams were found"
                />
            )}
        </>
    )
}
