import { Users } from "lucide-react"
import NoContentCard from "../ui/typography/NoContentMessage"
import { IProAthlete } from "../../types/athletes"
import PlayersList from "../players/PlayersList"

type Props = {
    athletes: IProAthlete[]
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

            <PlayersList 
                players={athletes}
            />

            {athletes.length === 0 && (
                <NoContentCard 
                    message="No Athletes were found"
                />
            )}
        </div>
    )
}
