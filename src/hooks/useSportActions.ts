import { useAtomValue } from "jotai";
import { useMemo } from "react";
import { sportActionDefinitionsAtom } from "../state/sportActions.atoms";

/** Provides hook to access sport action defintions */
export function useSportActions() {

    const defintions = useAtomValue(sportActionDefinitionsAtom);

    const categories: string[] = useMemo(() => {

        const seen : Set<string> = new Set();
        
        defintions.forEach((d) => {
            if (d.category && !seen.has(d.category)) {
                seen.add(d.category);
            }
        });

        return [...seen].sort((a, b) => a.localeCompare(b));

    }, [defintions]);

    const uiDefintions = useMemo(() => {
        
        const seenDisplayNames: string[] = [];
        
        return defintions.filter((d) => {
            const showOnUI = d.show_on_ui == true;
            const hasBeenSeen =  d.display_name && seenDisplayNames.includes(d.display_name);

            if (showOnUI && !hasBeenSeen && d.display_name) {
                seenDisplayNames.push(d.display_name);
                return true;
            }

            return false
        })
    }, [defintions]);

    return {
        defintions,
        categories,
        uiDefintions
    }
}