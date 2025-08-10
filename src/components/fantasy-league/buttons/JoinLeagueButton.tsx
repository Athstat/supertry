import { Swords } from 'lucide-react'
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups'
import PrimaryButton from '../../shared/buttons/PrimaryButton'
import { Fragment, useState } from 'react'
import { fantasyLeagueGroupsService } from '../../../services/fantasy/fantasyLeagueGroupsService'
import { Toast } from '../../ui/Toast'

type Props = {
    league: FantasyLeagueGroup
}

export default function JoinLeagueButton({ league }: Props) {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const handleJoinLeague = async () => {

        setLoading(true);

        try {

            const res = await fantasyLeagueGroupsService.joinLeague(
                league.id,
                league.entry_code ?? ""
            );

            if (res.data) {
                window.location.reload();
                setLoading(false);
            } else {
                setError(res.error?.message);
                setLoading(false);
            }


        } catch (err) {
            console.log("Error joining the league ", err);
            setError("Something wen't wrong joining league")
        }

        setLoading(false);
    }

    return (
        <Fragment>
            <PrimaryButton
                isLoading={isLoading}
                disabled={isLoading}
                onClick={handleJoinLeague}
            >
                <Swords />
                Join League
            </PrimaryButton>


            <Toast
                message={error ?? ""}
                type="error"
                isVisible={error !== undefined}
                onClose={() => setError(undefined)}
                duration={3000}
            />
        </Fragment>
    )
}
