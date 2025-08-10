import { Swords } from 'lucide-react'
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups'
import PrimaryButton from '../../shared/buttons/PrimaryButton'
import { useState } from 'react'

type Props = {
    league: FantasyLeagueGroup
}

export default function JoinLeagueButton({ league }: Props) {
    
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    return (
        <PrimaryButton>
            <Swords />
            Join League
        </PrimaryButton>
    )
}
