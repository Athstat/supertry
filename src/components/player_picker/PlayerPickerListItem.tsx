import { Plus } from "lucide-react";
import { Activity, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker";
import { usePlayerSeasonTeam } from "../../hooks/seasons/useSeasonTeams";
import { IProAthlete } from "../../types/athletes";
import TeamJersey from "../player/TeamJersey";
import AvailabilityIcon from "../players/availability/AvailabilityIcon";
import MatchPrCard from "../rankings/MatchPrCard";
import PrimaryButton from "../ui/buttons/PrimaryButton";
import SecondaryText from "../ui/typography/SecondaryText";
import { useInView } from "react-intersection-observer";

type PlayerListItemProps = {
    player: IProAthlete,
    onViewPlayerProfile?: (player: IProAthlete) => void,
    onSelectPlayer?: (player: IProAthlete) => void
}

/** Renders a player picker list item */
export function PlayerListItem({ player, onViewPlayerProfile, onSelectPlayer }: PlayerListItemProps) {

    const { remainingBudget } = usePlayerPicker();
    const { inView, ref } = useInView({ triggerOnce: true });
    const { seasonTeam } = usePlayerSeasonTeam(player);

    const isAffordable = (player?.price ?? 0) <= remainingBudget;

    const handleViewPlayerProfile = () => {
        if (onViewPlayerProfile) {
            onViewPlayerProfile(player);
        }
    }

    const handleSelectPlayer = useCallback(() => {

        if (!isAffordable) {
            return;
        }

        if (onSelectPlayer) {
            onSelectPlayer(player);
        }
    }, [onSelectPlayer, player, isAffordable]);

    return (
        <tr ref={ref} className={twMerge(
            "hover:bg-slate-50 items-center w-[100%]",
            !isAffordable && 'opacity-50',
            "dark:hover:bg-slate-800/50 hover:bg-slate-200"
        )} >
            <Activity mode={inView ? "visible" : "hidden"} >
                <td onClick={handleViewPlayerProfile} className="overflow-clip"  >

                    <div className="flex cursor-pointer flex-row items-center gap-2 w-full" >

                        <TeamJersey
                            teamId={seasonTeam?.athstat_id}
                            className={twMerge(
                                "min-h-10 max-h-10 min-w-10 max-w-10",
                                "lg:min-h-10 lg:max-h-10 lg:min-w-10 lg:max-w-10"
                            )}
                            key={player.tracking_id}
                            hideFade
                        />

                        <div className="flex flex-col w-fit" >
                            <div className="flex flex-row items-center gap-1" >
                                <p className="text-sm dark:text-white truncate" >{player.player_name}</p>
                                <AvailabilityIcon
                                    athlete={player}
                                    iconClassName="w-2 h-2"
                                    className="w-4 h-4 rounded-md"
                                />
                            </div>

                            {isAffordable && (
                                <div className="flex flex-row items-center " >
                                    <SecondaryText className="text-[10px]" >
                                        {seasonTeam?.athstat_name ?? player.position_class}
                                    </SecondaryText>
                                </div>
                            )}

                            {!isAffordable && (
                                <p className="text-red-500 text-[10px] font-medium" >Can't Afford this Player</p>
                            )}
                        </div>
                    </div>

                </td>

                <td className="" >
                    <SecondaryText>{player.price}</SecondaryText>
                </td>

                <td className="" >
                    <MatchPrCard pr={player.power_rank_rating} />
                </td>

                <td className="" >
                    <PrimaryButton onClick={handleSelectPlayer} className="w-fit px-2" >
                        <Plus className="w-4 h-4 " />
                    </PrimaryButton>
                </td>
            </Activity>

        </tr>
    )
}
