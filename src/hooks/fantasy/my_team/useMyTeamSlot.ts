import { useContext } from "react";
import { useMyTeamActions } from "./useMyTeamActions";
import { MyTeamSlotContext } from "../../../contexts/fantasy/my_team/MyTeamSlotContext";
import { useMyTeam } from "./useMyTeam";

export function useMyTeamSlot() {
    const context = useContext(MyTeamSlotContext);

    const { setCaptain } = useMyTeamActions();
    const {isSlotLocked: isSlotLockFunc, isShowPlayerLock, teamCaptain, isPlayerGameStarted} = useMyTeam();

    if (context === null) {
        throw new Error("useMyTeamSlot() was used outside the MyTeamSlotProvider")
    }


    const makeCaptain = () => {
        setCaptain(context.slot.slotNumber);
    }

    const isSlotLocked = isSlotLockFunc(context.slot);

    const isSub = !context.slot.is_starting || context.slot.slotNumber === 6;
    const isTeamCaptain = context.slot.athlete?.athlete_id === teamCaptain?.athlete?.athlete_id;

    const hasPlayerGameStarted = isPlayerGameStarted(context.slot?.athlete?.athlete);
    

    return {
        ...context,
        isSub,
        makeCaptain,
        isSlotLocked,
        isShowPlayerLock: isShowPlayerLock(context.slot.athlete?.athlete),
        isTeamCaptain,
        hasPlayerGameStarted
    }
}