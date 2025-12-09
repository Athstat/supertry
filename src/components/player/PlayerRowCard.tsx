import { IProAthlete } from "../../types/athletes"
import { formatPosition } from "../../utils/athleteUtils"
import { getCountryEmojiFlag } from "../../utils/svrUtils"
import MatchPrCard from "../rankings/MatchPrCard"
import SecondaryText from "../shared/SecondaryText"
import SmartPlayerMugshot from "./SmartPlayerMugshot"
import FormIndicator from "../shared/FormIndicator"
import { stripCountryName } from "../../utils/stringUtils"

type Props = {
    player: IProAthlete,
    onClick?: (player: IProAthlete) => void
}

/** Renders a player role card */
export default function PlayerRowCard({ player, onClick }: Props) {

    const countryFlag = getCountryEmojiFlag(player.nationality, true);

    

    const handelClick = () => {
        if (onClick) {
            onClick(player);
        }
    }

    return (
        <tr
            onClick={handelClick}
            className="cursor-pointer hover:bg-slate-800"
        >
            <td className="py-3" >
                <div className="flex flex-row items-center gap-2" >
                    <div>
                        <SmartPlayerMugshot
                            url={player.image_url}
                            teamId={player.team_id}
                            playerImageClassName="bg-transparent"
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
                                        {countryFlag} {stripCountryName(player.nationality)}
                                    </SecondaryText>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </td>


            <td className="flex py-3 flex-row items-center justify-center gap-1" >
                <p className="text-xs" >{player.price}</p>
                {/* <Coins className="text-yellow-500 w-3 h-3" /> */}
            </td>

            <td className="py-3" >
                <div className="flex flex-row items-center justify-center w-full flex-1" >
                    {player.form ? <FormIndicator form={player.form} /> : "-"}
                </div>
            </td>
            
            <td className="flex py-3 flex-col gap-1 items-center justify-center" >
                <MatchPrCard
                    pr={player.power_rank_rating}
                />
            </td>

        </tr>
    )
}
