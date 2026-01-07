import { useSetAtom } from 'jotai';
import { sportActionDefinitionsAtom } from '../state/sportActions.atoms'
import {ScopeProvider} from 'jotai-scope';
import { swrFetchKeys } from '../utils/swrKeys';
import { sportActionsService } from '../services/sportActionsService';
import { ReactNode, useEffect } from 'react';
import ScrummyLoadingState from '../components/ui/ScrummyLoadingState';
import useSWR from 'swr';
import { CACHING_CONFIG } from '../types/constants';

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
        revalidateIfStale: true,
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