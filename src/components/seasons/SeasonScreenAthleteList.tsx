import { Users } from "lucide-react"
import { RugbyPlayer } from "../../types/rugbyPlayer"
import { PlayerGameCard } from "../player/PlayerGameCard"
import NoContentCard from "../shared/NoContentMessage"

type Props = {
    athletes: RugbyPlayer[]
}

/** Renders Season Athletes List */
export default function SeasonScreenAthleteList({ athletes }: Props) {

    if (athletes.length === 0) {
        return;
    }


    return (
        <div className="flex flex-col gap-2" >
            <div className="flex flex-row items-center gap-2" >
                <Users />
                <h1 className="text-lg font-bold" >Top Athletes</h1>
            </div>

            <div className="flex flex-row items-center gap-2 overflow-x-auto" >
                {athletes.map((a, index) => {
                    return <PlayerGameCard className="h-[170px] w-[130px]" player={a} key={index} />
                })}
            </div>

            {athletes.length === 0 && (
                <NoContentCard 
                    message="No Athletes were found"
                />
            )}
        </div>
    )
}
