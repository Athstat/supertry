import { useContext } from "react";
import { MyTeamContext } from "../../../contexts/fantasy/my_team/MyTeamContext";

export function useMyTeam() {
    const context = useContext(MyTeamContext);

    if (context === null) {
        throw new Error("useMyTeam() used outside MyTeamProvider");
    }

    return {
        ...context
    }
}