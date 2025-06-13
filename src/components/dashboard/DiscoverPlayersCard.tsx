import { Users } from "lucide-react"
import RoundedCard from "../shared/RoundedCard"
import { AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import SecondaryText from "../shared/SecondaryText"

export default function DiscoverPlayersCard() {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/players");
    }

    return (
        <div
            onClick={handleClick}
        >
            <AnimatePresence>

                <RoundedCard className="relative overflow-hidden cursor-pointer" >

                    {/* <div className="absolute inset-0 bg-blue-500 hover:bg-blue-600 flex flex-row items-start justify-end" >
                        {players.map((player, index) => {
                            return <PlayerGameCard key={index} className="w-[150px] h-[100]" player={player} />
                        })}
                    </div> */}

                    {/* <div className={twMerge(
                        "absolute z-10 inset-0 bg-gradient-to-r from-primary-800 to-blue-900/80 transition-all duration-500 ease-in-out",
                        isHovering && "from-primary-800 to-blue-800/80"
                    )} >

                    </div> */}

                    <div className="relative z-20  p-6 lg:p-10 flex flex-col gap-2" >
                        <div className="flex flex-row items-center gap-2" >
                            <Users className="dark:text-primary-400 text-primary-500" />
                            <h2 className="text-lg md:text-xl font-bold" >Discover Players</h2>
                        </div>
                        <SecondaryText className=" text-sm md:text-base" >Search, discover & compare your favourite rugby players</SecondaryText>
                    </div>


                    {/* <div className="flex px-4 gap-2 pb-4 flex-row items-center" >
                        {players
                        .filter(a => a.image_url !== undefined)
                        .map((a, index) => {
                            return <div key={a.tracking_id} className="items-center flex flex-col gap-1" >
                                <PlayerMugshot
                                    playerPr={a.power_rank_rating}
                                    showPrBackground
                                    url={a.image_url}
                                />
                            </div>
                        })}
                    </div> */}
                </RoundedCard>
            </AnimatePresence>
        </div>
    )
}


// async function topThreePlayersFetcher(competitionId: string) {
//     const players = await athleteService.getRugbyAthletesByCompetition(
//         competitionId
//     );

//     return players.sort((a, b) => {
//         return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0)
//     }).splice(0, 6);
// }