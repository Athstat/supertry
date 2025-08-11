import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups'
import PrimaryButton from '../../shared/buttons/PrimaryButton'
import { Fragment } from 'react'
import { Toast } from '../../ui/Toast'
import { useJoinLeague } from '../../../hooks/leagues/useJoinLeague'

type Props = {
    league: FantasyLeagueGroup
}

export default function JoinLeagueButton({ league }: Props) {

    const {isLoading, error, handleJoinLeague, clearError} = useJoinLeague();

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
