import { ReactNode, useCallback } from 'react'
import { IFantasyLeagueTeam } from '../../../types/fantasyLeague'
import { ScopeProvider } from 'jotai-scope'
import { myTeamModeAtom } from '../../../state/fantasy/myTeam.atoms'
import { useAtom } from 'jotai'
import { MyTeamViewMode } from '../../../types/fantasy/myTeam'
import FantasyLeagueTeamProvider from './FantasyLeagueTeamProvider'

type Props = {
    children?: ReactNode,
    team: IFantasyLeagueTeam
}

/** Provides state for my team screen/view to child components */
export default function MyTeamViewStateProvider({ children, team }: Props) {

    const atoms = [myTeamModeAtom];

    return (
        <ScopeProvider atoms={atoms} >
            <InnerProvider team={team} >
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}

function InnerProvider({ children, team }: Props) {
    return (
        <>
            <FantasyLeagueTeamProvider team={team}>
                {children}
            </FantasyLeagueTeamProvider>
        </>
    )
}

/** Provides a hook to access the state of the my team view */
export function useMyTeamView() {
    const [mode, setMode] = useAtom(myTeamModeAtom);

    const navigate = useCallback((tab: MyTeamViewMode) => {

        setMode(tab);

    }, [setMode]);

    const viewMode = mode;

    return {
        navigate,
        mode,
        viewMode
    }
}