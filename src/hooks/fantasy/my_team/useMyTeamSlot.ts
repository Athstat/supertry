import { useContext } from "react";
import { MyTeamContext } from "../../../contexts/fantasy/my_team/MyTeamContext";

export function useMyTeamSlot() {
    const context = useContext(MyTeamContext);

    if (context === null) {
        throw new Error("useMyTeamSlot() was used outside the MyTeamSlotProvider")
    }

    return {
        ...context
    }
}