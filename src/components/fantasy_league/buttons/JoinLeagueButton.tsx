import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups'
import PrimaryButton from '../../ui/buttons/PrimaryButton'
import { Activity, Fragment, useMemo } from 'react'
import { Toast } from '../../ui/Toast'
import { useJoinLeague } from '../../../hooks/leagues/useJoinLeague'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'
import { useAuth } from '../../../contexts/AuthContext'
import useSWR from 'swr'
import { fantasyLeagueGroupsService } from '../../../services/fantasy/fantasyLeagueGroupsService'
import LeagueInviteButton from './LeagueInviteButton'

type Props = {
    league: FantasyLeagueGroup
}

export default function JoinLeagueButton({ league }: Props) {

    const { isLoading, error, handleJoinLeague, clearError } = useJoinLeague();

    return (
        <Fragment>
            <PrimaryButton
                isLoading={isLoading}
                disabled={isLoading}
                onClick={() => handleJoinLeague(league)}
            >
                Join
            </PrimaryButton>


            <Toast
                message={error ?? ""}
                type="error"
                isVisible={error !== undefined}
                onClose={clearError}
                duration={3000}
            />
        </Fragment>
    )
}


/** Renders join or invite league button, requires
 * fantasy league group button */
export function JoinOrInviteButton() {
    const { authUser } = useAuth();
    const { league } = useFantasyLeagueGroup();

    const key = `/fantasy-league-groups/${league?.id}/members/${authUser?.kc_id}`;
    const { isLoading, data: member } = useSWR(key, () => fantasyLeagueGroupsService.getMemberById(league?.id ?? "", authUser?.kc_id ?? ""))

    const isMember = useMemo(() => {
        return member !== undefined;
    }, [member]);

    const shouldHide = !league || isLoading

    return (
        <div className='min-w-24 min-h-8 max-w-24 max-h-8' >
            <Activity mode={shouldHide ? "hidden" : "visible"} >
                
                {!isMember && league && <JoinLeagueButton league={league} />}

                {isMember && league && (
                    <LeagueInviteButton />
                )}

            </Activity>
        </div>
    )
}