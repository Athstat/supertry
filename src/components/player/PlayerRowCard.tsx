import { IProAthlete } from "../../types/athletes"
import { formatPosition } from "../../utils/athletes/athleteUtils"
import { getCountryEmojiFlag } from "../../utils/svrUtils"
import MatchPrCard from "../rankings/MatchPrCard"
import SecondaryText from "../ui/typography/SecondaryText"
import SmartPlayerMugshot from "./SmartPlayerMugshot"
import FormIndicator from "./FormIndicator"
import { stripCountryName } from "../../utils/stringUtils"
import { useInView } from "react-intersection-observer"
import { usePlayerSeasonTeam } from "../../hooks/seasons/useSeasonTeams"
import AvailabilityIcon from "../players/availability/AvailabilityIcon"


type Props = {
    player: IProAthlete,
    onClick?: (player: IProAthlete) => void
}

/** Renders a player role card */
export default function PlayerRowCard({ player, onClick }: Props) {

    const { ref, inView } = useInView({ triggerOnce: true });
    const countryFlag = getCountryEmojiFlag(player.nationality, true);

    const { seasonTeam } = usePlayerSeasonTeam(player);

    const handelClick = () => {
        if (onClick) {
            onClick(player);
        }
    }

    return (

        <tr
            ref={ref}
            onClick={handelClick}
            className="cursor-pointer"
        >
            {inView && <>
                <td className="py-3" >
                    <div className="flex flex-row items-center gap-2" >
                        <div>
                            <SmartPlayerMugshot
                                teamId={seasonTeam?.athstat_id}
                                playerImageClassName="bg-transparent"
                            />
                        </div>

                        <div>

                            <div>
                                <p className="text-sm" >{player.player_name}</p>

                            </div>


                            <div className="flex flex-row items-center gap-1" >

                                <SecondaryText className="text-[11px]  truncate" >{formatPosition(player.position)} </SecondaryText>

                                {player.nationality && (
                                    <>
                                        <div className="w-1 h-1 rounded-full bg-slate-700 dark:bg-slate-400" ></div>

                                        <SecondaryText className="text-[11px] max-w-[80px] truncate" >
                                            {countryFlag} {stripCountryName(player.nationality)}
                                        </SecondaryText>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <AvailabilityIcon 
                                athlete={player}
                                shouldFetch={inView}
                            />
                        </div>
                    </div>
                </td>


                <td className="py-3 " >
                    <div className="flex flex-row items-center justify-center w-full flex-1" >
                        <p className="text-xs" >{player.price}</p>
                    </div>
                </td>

                <td className="py-3" >
                    <div className="flex flex-row items-center justify-center w-full flex-1" >
                        {player.form ? <FormIndicator form={player.form} /> : "-"}
                    </div>
                </td>

                <td className="py-3 " >
                    <div className="flex flex-row items-center justify-center w-full flex-1" >
                        <MatchPrCard
                            pr={player.power_rank_rating}
                        />
                    </div>
                </td>
            </>}
        </tr>
    )
}
