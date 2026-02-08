import { useContext } from "react";
import { MyTeamContext } from "../../../contexts/fantasy/my_team/MyTeamContext";
import { MAX_TEAM_BUDGET } from "../../../types/constants";

export function useMyTeam() {
    const context = useContext(MyTeamContext);

    if (context === null) {
        throw new Error("useMyTeam() used outside MyTeamProvider");
    }

    const totalSpent = context.slots.reduce((total, curr) => {
        return (curr.athlete?.purchase_price ?? curr.purchasePrice ?? 0) + total
    }, 0);

    const budgetRemaining = MAX_TEAM_BUDGET - totalSpent;
    
    const selectedCount = context.slots.reduce((total, curr) => {
        if (curr.athlete) {
            return total + 1;
        }

        return total;
    }, 0);

    return {
        ...context,
        totalSpent, 
        budgetRemaining,
        selectedCount
    }
}