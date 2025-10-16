import { TriangleAlert } from "lucide-react"
import { useGeneralPlayerAvailability } from "../../../hooks/fantasy/usePlayerSquadReport"
import { IProAthlete } from "../../../types/athletes"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"
import { IFantasyAthlete } from "../../../types/rugbyPlayer"

type Props = {
    athlete: IProAthlete | IFantasyAthlete | IFantasyTeamAthlete
}

/** Renders an Availability Indicator Icon, usually to be placed on top of a card */
export default function AvailabilityIcon({athlete} : Props) {

    const {report, isLoading} = useGeneralPlayerAvailability(athlete.tracking_id);

    if (isLoading) {
        return;
    }

    if (report?.status === "PENDING") {
        return;
    }

    if (report?.status === "TEAM_NOT_PLAYING") {
        return;
    }

    const notAvailable = report?.status === "NOT_AVAILABLE";

    if (!notAvailable) {
        return;
    }

    return (
        <div>
            <div className="flex flex-row items-center gap-2 justify-end" >
                {/* <p className="text-xs" >Player Not Aviailable</p> */}
                <div className="bg-yellow-100 dark:bg-yellow-900/40 hover:bg-yellow-400 border border-yellow-500 dark:border-yellow-400 w-7 h-7 rounded-xl flex flex-col items-center justify-center" >
                    <TriangleAlert className="w-4 text-yellow-500 dark:text-yellow-400 h-4" />
                </div>
            </div>
        </div>
    )
}
