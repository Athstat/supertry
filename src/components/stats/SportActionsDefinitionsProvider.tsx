import { useAtomValue, useSetAtom } from 'jotai';
import { sportActionDefinitionsAtom } from '../../state/sportActions.atoms'
import {ScopeProvider} from 'jotai-scope';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { sportActionsService } from '../../services/sportActionsService';
import { ReactNode, useEffect, useMemo } from 'react';
import ScrummyLoadingState from '../ui/ScrummyLoadingState';

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
    const {data: fetchedDefintions, isLoading} = useSWR(key, () => sportActionsService.getDefinitionList());

    useEffect(() => {
        if (fetchedDefintions) setDefintions(fetchedDefintions);
    }, [fetchedDefintions]);

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
        return defintions.filter((d) => {
            return d.show_on_ui == true
        })
    }, [defintions]);

    return {
        defintions,
        categories,
        uiDefintions
    }
}