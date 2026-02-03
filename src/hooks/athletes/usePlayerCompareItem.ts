import { useContext, useMemo } from "react";
import { PlayerCompareItemContext } from "../../contexts/ui/PlayerCompareItemContext";

/** Hook that provides access to the PlayerCompareItemContext */
export function usePlayerCompareItem() {
    const context = useContext(PlayerCompareItemContext);

    if (!context) {
        throw Error("usePlayerCompareItem() hook was called outside the PlayerCompareItemProvider");
    }

    const hasNoData = useMemo(() => {
        return !context.isLoading && (context.seasons.length === 0);
    }, [context.isLoading, context.seasons.length]);

    return {
        ...context, hasNoData
    }
}