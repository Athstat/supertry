import { useContext } from "react";
import { PlayerCompareItemContext } from "../../contexts/PlayerCompareItemContext";

/** Hook that provides access to the PlayerCompareItemContext */
export function usePlayerCompareItem() {
    const context = useContext(PlayerCompareItemContext);

    if (!context) {
        throw Error("usePlayerCompareItem() hook was called outside the PlayerCompareItemProvider");
    }

    return {
        ...context
    }
}