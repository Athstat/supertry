import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
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

    const getDefinition = useCallback((name?: string) => {
        return defintions.find((def) => {
            const matchesActionName = ((def.action_name || 'action_name').toLowerCase() === (name || 'name').toLowerCase());
            const matchesDisplayName = ((def.display_name || 'action_name').toLowerCase() === (name || 'name').toLowerCase());

            return matchesActionName || matchesDisplayName
        })
    }, [defintions])

    return {
        defintions,
        categories,
        uiDefintions,
        getDefinition
    }
}