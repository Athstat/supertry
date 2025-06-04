import { Users } from "lucide-react"
import RoundedCard from "../shared/RoundedCard"
import { useFetch } from "../../hooks/useFetch"
import { athleteService } from "../../services/athleteService"
import { URC_COMPETIION_ID } from "../../types/constants"
import { PlayerGameCard } from "../player/PlayerGameCard"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"

export default function DiscoverPlayersCard() {

    const { data, isLoading } = useFetch("players-no-cache", URC_COMPETIION_ID, topThreePlayersFetcher);
    const [isHovering, setHovering] = useState(false);

    const navigate = useNavigate();

    if (isLoading) {
        return <RoundedCard className="p-10 animate-pulse" >

        </RoundedCard>
    }

    const players = data ?? [];

    const handleClick = () => {
        navigate("/players");
    }

    return (
        <div
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={handleClick}
        >
            <AnimatePresence>

                <RoundedCard className="relative overflow-hidden cursor-pointer" >

                    <div className="absolute inset-0 bg-blue-500 hover:bg-blue-600 flex flex-row items-start justify-end" >
                        {players.map((player, index) => {
                            return <PlayerGameCard key={index} className="w-[150px] h-[100]" player={player} />
                        })}
                    </div>

                    <div className={twMerge(
                        "absolute z-10 inset-0 bg-gradient-to-r from-primary-800 to-blue-900/80 transition-all duration-500 ease-in-out",
                        isHovering && "from-blue-700 to-blue-800/80"
                    )} >

                    </div>

                    <div className="relative z-20 text-white p-6 lg:p-10 flex flex-col gap-2" >
                        <div className="flex flex-row items-center gap-2" >
                            <Users />
                            <h2 className="text-xl font-bold" >Discover Players</h2>
                        </div>
                        <p className="text-white/80" >Search, discover & compare your favourite rugby players</p>
                    </div>

                </RoundedCard>
            </AnimatePresence>
        </div>
    )
}


async function topThreePlayersFetcher(competitionId: string) {
    const players = await athleteService.getRugbyAthletesByCompetition(
        competitionId
    );

    return players.sort((a, b) => {
        return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0)
    }).splice(0, 7);
}