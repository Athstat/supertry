import { useAtomValue, useSetAtom } from 'jotai';
import { sportActionDefinitionsAtom } from '../../state/sportActions.atoms'
import {ScopeProvider} from 'jotai-scope';
import { swrFetchKeys } from '../../utils/swrKeys';
import { sportActionsService } from '../../services/sportActionsService';
import { ReactNode, useEffect, useMemo } from 'react';
import ScrummyLoadingState from '../ui/ScrummyLoadingState';
import useSWR from 'swr';
import { CACHING_CONFIG } from '../../types/constants';

type Props = {
    children?: ReactNode
}

/** Provides sport action defintions to child components */
export default function SportActionsDefinitionsProvider({children} : Props) {

    const atoms = [
        sportActionDefinitionsAtom
    ]

    return (
        <ScopeProvider
            atoms={atoms}
        >
            <Content>
                {children}
            </Content>
        </ScopeProvider>
    )
}

function Content({children} : Props) {
    const setDefintions = useSetAtom(sportActionDefinitionsAtom);
    
    const key = swrFetchKeys.getSportActionsDefinitions();
    const {data: fetchedDefintions, isLoading} = useSWR(key, () => sportActionsService.getDefinitionList(), {
        dedupingInterval: CACHING_CONFIG.sportsActionCachePeriod,
        refreshWhenHidden: false,
        revalidateIfStale: true,
        revalidateOnMount: false,
        revalidateOnFocus: false
    });

    useEffect(() => {
        if (fetchedDefintions) setDefintions(fetchedDefintions);
    }, [fetchedDefintions, setDefintions]);

    if (isLoading) return <ScrummyLoadingState />

    return (
        <>
        {children}
        </>
    )
}

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