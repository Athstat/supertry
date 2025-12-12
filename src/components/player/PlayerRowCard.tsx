import { Coins } from "lucide-react"
import { IProAthlete } from "../../types/athletes"
import { formatPosition } from "../../utils/athleteUtils"
import { getCountryEmojiFlag } from "../../utils/svrUtils"
import MatchPrCard from "../rankings/MatchPrCard"
import RoundedCard from "../shared/RoundedCard"
import SecondaryText from "../shared/SecondaryText"
import SmartPlayerMugshot from "./SmartPlayerMugshot"

type Props = {
    player: IProAthlete,
    onClick?: () => void
}

/** Renders a player role card */
export default function PlayerRowCard({ player, onClick }: Props) {

    const countryFlag = getCountryEmojiFlag(player.nationality, true);

    return (
        <RoundedCard
            onClick={onClick}
            className="flex cursor-pointer dark:border-none flex-row w-full items-center justify-between gap-2 p-3"
        >
            <div className="flex flex-row items-center gap-2" >
                <div>
                    <SmartPlayerMugshot
                        url={player.image_url}
                        teamId={player.team_id}
                    />
                </div>

                <div>
                    <div>
                        <p className="text-sm" >{player.player_name}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2" >

                        <SecondaryText className="text-xs" >{formatPosition(player.position)} </SecondaryText>

                        {player.nationality && (
                            <>
                                <div className="w-1 h-1 rounded-full bg-slate-700 dark:bg-slate-400" ></div>

                                <SecondaryText className="text-xs" >
                                    {countryFlag} {player.nationality}
                                </SecondaryText>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-row items-center gap-4" >
                
                <div className="flex flex-row items-center gap-1" >
                    <p className="text-xs" >{player.price}</p>
                    <Coins className="text-yellow-500 w-3 h-3" />
                </div>

                <div className="flex flex-col gap-1 items-center justify-center" >
                    <MatchPrCard
                        pr={player.power_rank_rating}
                    />
                    <SecondaryText className="text-[10px]" >Rating</SecondaryText>
                </div>
            </div>
        </RoundedCard >
    )
}
