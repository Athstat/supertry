import { Activity, useCallback } from "react";
import useSWR from "swr";
import { useScoutingList } from "../../hooks/fantasy/scouting/useScoutingList";
import { scoutingService } from "../../services/fantasy/scoutingService";
import { IProAthlete } from "../../types/athletes"
import { swrFetchKeys } from "../../utils/swrKeys";
import BottomSheetView from "../ui/BottomSheetView"
import { twMerge } from "tailwind-merge";
import { lighterDarkBlueCN } from "../../types/constants";
import CircleButton from "../shared/buttons/BackButton";
import { X } from "lucide-react";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import RoundedCard from "../shared/RoundedCard";

type Props = {
    player: IProAthlete,
    onClose?: () => void,
    isOpen?: boolean
}

/** Renders a player scouting action modal */
export default function PlayerScoutingActionModal({ isOpen, player, onClose }: Props) {

    // We need to know if player is currently being scouted!
    const key = swrFetchKeys.getScoutingListPlayer(player.tracking_id);
    const { mutate } = useSWR(key, () => scoutingService.getScoutingListPlayer(player.tracking_id));

    const {removePlayer, isRemoving } = useScoutingList();

    const handleRemoveSuccess = useCallback(async () => {
        await mutate();
        if (onClose) onClose();
    }, [mutate, onClose])

    const onRemovePlayer = useCallback(async () => {
        await removePlayer(player.tracking_id, handleRemoveSuccess);

    }, [handleRemoveSuccess, player.tracking_id, removePlayer]);

    return (
        <Activity mode={isOpen ? "visible" : "hidden"} >
            <BottomSheetView
                hideHandle
                className={twMerge(lighterDarkBlueCN, "p-6 min-h-[20vh] ")}
                showTopBorder
                overlayBg
            >
                <div className="flex flex-row items-center justify-between" >
                    <p className="font-semibold" >Player Scouting Actions</p>

                    <CircleButton
                        className="w-9 h-9 dark:bg-slate-700"
                    >
                        <X />
                    </CircleButton>
                </div>

                <div className="flex flex-col items-center justify-center gap-2" >

                    <RoundedCard className="dark:bg-slate-700/70 cursor-pointer text-sm font-medium dark:hover:bg-slate-700 p-2 rounded-xl w-full flex flex-col items-center justify-center" >
                        View Full Scouting List
                    </RoundedCard>

                    <PrimaryButton
                        destroy
                        onClick={onRemovePlayer}
                        isLoading={isRemoving}
                    >
                        Remove From Scouting List
                    </PrimaryButton>

                </div>
            </BottomSheetView>
        </Activity>
    )
}
