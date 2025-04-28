import { forwardRef } from "react"
import { RugbyPlayer } from "../../../types/rugbyPlayer"
import { Calendar, Trophy, Zap } from "lucide-react"
import { GroupedStatsGrid } from "../../shared/GroupedStatsGrid"
import { StatCard } from "../../shared/StatCard"
import { format } from "date-fns"
import { calculateAge } from "../../../utils/playerUtils"

type Props = {
    player: RugbyPlayer
}

export const PlayerProfileOverview = forwardRef<HTMLDivElement, Props>(({ player }, ref) => {

    const utcDob = player.date_of_birth ? new Date(player.date_of_birth) : undefined;
    const dob = utcDob ? new Date(utcDob.getFullYear(), utcDob.getMonth(), utcDob.getDay()) : undefined;

    return (
        <GroupedStatsGrid title="Overview" ref={ref} >

            {dob && <StatCard
                label="Born"
                value={format(dob, "dd MMMM yyyy")}
                icon={<Calendar className="text-orange-500" size={20} />}
                valueClassName="text-xl"
            />}

            {dob && <StatCard
                label="Age"
                value={calculateAge(dob)}
                icon={<Calendar className="text-orange-500" size={20} />}
            />}


            <StatCard
                label="Power Ranking"
                value={player.power_rank_rating || 0}
                icon={<Trophy className="text-purple-500" size={20} />}
            />
            <StatCard
                label="Points"
                value={player.price || 0}
                icon={<Zap className="text-yellow-500" size={20} />}
            />
        </GroupedStatsGrid>
    )
})
