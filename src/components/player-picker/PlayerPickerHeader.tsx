import { useEffect } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker"
import SearchBar from "../team-creation/player-selection-components/SearchBar";
import PlayerPickerTeamFilterRow from "./PlayerPickerTeamFilterRow";
import BlueGradientCard from "../shared/BlueGradientCard";
import { twMerge } from "tailwind-merge";
import Experimental from "../shared/ab_testing/Experimental";
import RoundedCard from "../shared/RoundedCard";
import PlayerMugshot from "../shared/PlayerMugshot";
import { formatPosition } from "../../utils/athleteUtils";
import SecondaryText from "../shared/SecondaryText";
import { Repeat } from "lucide-react";

export default function PlayerPickerHeader() {

    const { searchQuery, setSearchQuery, maxPrice, playerToBeReplaced } = usePlayerPicker();

    useEffect(() => {
        return () => {
            setSearchQuery(undefined);
        }
    }, []);

    return (
        <div className="flex flex-col gap-2" >

            <Experimental>
                <BlueGradientCard
                    className={twMerge(
                        "flex flex-row items-center justify-center  py-2",
                        "from-blue-600 to-purple-700"
                    )}
                >
                    <p className="text-sm font-medium" >Budget ${maxPrice}</p>
                </BlueGradientCard>
            </Experimental>

            <div className="flex rounded-xl flex-row items-center gap-2 w-full" >
                {/* <InputField 
                    className="w-full " 
                    inputCn="focus:ring-transparent"
                /> */}

                <SearchBar
                    className="w-full"
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholder="Search by Name"
                />
            </div>

            <PlayerPickerTeamFilterRow />

            {playerToBeReplaced && (
                <div className="flex flex-col gap-1" >
                    <div className="flex flex-row items-center gap-1 text-slate-500 dark:text-slate-400 " >
                        <Repeat className="w-3 h-3" />
                        <p className="text-xs" >Player to be replaced</p>
                    </div>
                    <RoundedCard className="py-2 px-4 flex flex-row items-center gap-2" >
                        {/* <TeamJersey
                            teamId={playerToBeReplaced?.team_id}
                            className={twMerge(
                                "min-h-10 max-h-10 min-w-10 max-w-10",
                                "lg:min-h-10 lg:max-h-10 lg:min-w-10 lg:max-w-10"
                            )}
                            key={playerToBeReplaced.tracking_id}
                            hideFade
                        /> */}

                        {playerToBeReplaced.image_url && (<PlayerMugshot 
                            url={playerToBeReplaced.image_url}
                            key={playerToBeReplaced.tracking_id}
                            className="w-10 h-10"
                        />)}

                        <div>
                            <p className="text-sm font-medium" >{playerToBeReplaced.player_name}</p>
                            <SecondaryText className="text-xs" >{playerToBeReplaced.position_class ? formatPosition(playerToBeReplaced.position_class) : null}</SecondaryText>
                        </div>

                        <div className="flex-1 w-full flex flex-row items-center justify-end" >
                            <div className="" >
                                <p className="text-sm font-bold" >{playerToBeReplaced.power_rank_rating ? Math.floor(playerToBeReplaced.power_rank_rating) : "-"}</p>
                                <SecondaryText className="text-xs" >PR</SecondaryText>
                            </div>
                        </div>
                    </RoundedCard>
                </div>
            )}

        </div>
    )
}
