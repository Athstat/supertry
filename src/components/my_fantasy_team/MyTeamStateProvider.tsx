import { ReactNode, useCallback } from 'react'
import { ScopeProvider } from 'jotai-scope'
import { useAtom } from 'jotai'
import FantasyTeamProvider from '../../providers/fantasy_teams/FantasyTeamProvider'
import { myTeamModeAtom } from '../../state/fantasy/myTeam.atoms'
import { MyTeamViewMode } from '../../types/fantasy/myTeam'
import { IFantasyLeagueTeam } from '../../types/fantasyLeague'

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
            <FantasyTeamProvider team={team}>
                {children}
            </FantasyTeamProvider>
        </>
    )
}

// TODO: Move hook to right place
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