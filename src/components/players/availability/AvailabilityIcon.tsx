import { TriangleAlert } from "lucide-react"
import { useGeneralPlayerAvailability } from "../../../hooks/fantasy/usePlayerSquadReport"
import { IProAthlete } from "../../../types/athletes"
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete"
import { IFantasyAthlete } from "../../../types/rugbyPlayer"
import WarningCard from "../../shared/WarningCard"
import { useMemo } from "react"
import { IProTeam } from "../../../types/team"
import { useNavigate } from "react-router-dom"

type Props = {
    athlete: IProAthlete | IFantasyAthlete | IFantasyTeamAthlete
}

/** Renders an Availability Indicator Icon, usually to be placed on top of a card */
export default function AvailabilityIcon({ athlete }: Props) {

    const { report, isLoading } = useGeneralPlayerAvailability(athlete.tracking_id);

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
                <div className="bg-yellow-100 dark:bg-yellow-900/40 hover:bg-yellow-400 border border-yellow-500 dark:border-yellow-700 w-7 h-7 rounded-xl flex flex-col items-center justify-center" >
                    <TriangleAlert className="w-4 text-yellow-500 dark:text-yellow-500 h-4" />
                </div>
            </div>
        </div>
    )
}

/** Renders an Availability Text Report explaining the absense, usually to be placed on top of a card */
export function AvailabilityText({ athlete }: Props) {

    const navigate = useNavigate();
    const { report, isLoading } = useGeneralPlayerAvailability(athlete.tracking_id);

    const opposition = useMemo<IProTeam | undefined>(() => {

        if (!report) return undefined;

        const { game } = report;
        const athelteTeamId = athlete.team_id;

        if (athelteTeamId !== game?.team?.athstat_id) {
            return game?.team;
        }

        return game?.opposition_team;
    }, [report, athlete]);

    if (isLoading) {
        return;
    }

    if (!report) {
        return;
    }

    if (report?.status === "PENDING") {
        return;
    }

    if (report?.status === "TEAM_NOT_PLAYING") {
        return;
    }

    const notAvailable = Boolean(report.game) && report?.status === "NOT_AVAILABLE";

    if (!notAvailable) {
        return;
    }

    const handleViewGame = () => {
        navigate(`/fixtures/${report.game?.game_id}`);
    }

    return (
        <WarningCard>
            <TriangleAlert className="min-w-5  min-h-5" />
            <p className="text-xs" >
                {athlete.player_name} is not on the team roster for the match 
                against <span onClick={handleViewGame} className="underline cursor-pointer text-primary-500" >
                        <strong>{opposition?.athstat_name}</strong>
                    </span>
                    . 
                Consider taking action if he is in your team
            </p>
        </WarningCard>
    )
}

