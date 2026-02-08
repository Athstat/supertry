import { useContext } from "react";
import { useMyTeamActions } from "./useMyTeamActions";
import { MyTeamSlotContext } from "../../../contexts/fantasy/my_team/MyTeamSlotContext";
import { useMyTeam } from "./useMyTeam";

export function useMyTeamSlot() {
    const context = useContext(MyTeamSlotContext);

    const { setCaptain } = useMyTeamActions();
    const {isSlotLocked: isSlotLockFunc, isShowPlayerLock, teamCaptain} = useMyTeam();

    if (context === null) {
        throw new Error("useMyTeamSlot() was used outside the MyTeamSlotProvider")
    }


    const makeCaptain = () => {
        setCaptain(context.slot.slotNumber);
    }

    const isSlotLocked = isSlotLockFunc(context.slot);

    const isSub = !context.slot.is_starting || context.slot.slotNumber === 6;
    const isTeamCaptain = context.slot.athlete?.athlete_id === teamCaptain?.athlete?.athlete_id;

    return {
        ...context,
        isSub,
        makeCaptain,
        isSlotLocked,
        isShowPlayerLock: isShowPlayerLock(context.slot.athlete?.athlete),
        isTeamCaptain
    }
}