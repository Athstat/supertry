import { ArrowLeft } from 'lucide-react'
import CircleButton from '../../ui/buttons/BackButton'
import { JoinOrInviteButton } from '../buttons/JoinLeagueButton'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'

type Props = {
    handleBack?: () => void
}

/** Renders a fantasy league standings header */
export default function LeagueStandingsHeader({ handleBack }: Props) {

    const {league} = useFantasyLeagueGroup();

    return (
        <div className="flex px-4 flex-row items-center justify-between" >
            <div>
                <CircleButton
                    onClick={handleBack}
                >
                    <ArrowLeft />
                </CircleButton>
            </div>

            <div>
                <p>{league?.title}</p>
            </div>

            <JoinOrInviteButton />
        </div>
    )
}
