import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups'
import PrimaryButton from '../../shared/buttons/PrimaryButton'
import { Fragment } from 'react'
import { Toast } from '../../ui/Toast'
import { useJoinLeague } from '../../../hooks/leagues/useJoinLeague'
import { Share2 } from 'lucide-react'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'
import { useShareLeague } from '../../../hooks/leagues/useShareLeague'

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
    const { league, isMember } = useFantasyLeagueGroup();
    const { handleShare } = useShareLeague(league);

    if (!league) {
        return;
    }

    return (
        <div>
            {!isMember && <JoinLeagueButton league={league} />}

            {isMember && (
                <PrimaryButton onClick={handleShare} className='text-xs' >
                    {/* <Plus className="w-4 h-4" /> */}
                    <Share2 className="w-4 h-4" />
                    Invite
                </PrimaryButton>
            )}
        </div>
    )
}