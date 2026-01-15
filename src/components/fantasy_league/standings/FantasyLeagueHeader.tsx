import { ArrowLeft } from 'lucide-react'
import CircleButton from '../../ui/buttons/BackButton'
import { JoinOrInviteButton } from '../buttons/JoinLeagueButton'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'
import LeagueGroupBanner from '../LeagueGroupBanner'
import { twMerge } from 'tailwind-merge'
import { AppColours } from '../../../types/constants'

type Props = {
    handleBack?: () => void
}

/** Renders a fantasy league standings header */
export default function FantasyLeagueHeader({ handleBack }: Props) {

    const { league } = useFantasyLeagueGroup();

    return (
        <div className="flex flex-col relative" >

            <LeagueGroupBanner league={league} />

            <div className={twMerge(
                'flex absolute top-0 left-0 w-full pt-2 px-4 flex-row items-center justify-between pb-10',
                'bg-gradient-to-b to-transparent',
                AppColours.BACKGROUND_GRADIENT
            )} >
                <div className='flex flex-row items-center gap-2' >
                    <CircleButton
                        onClick={handleBack}
                    >
                        <ArrowLeft />
                    </CircleButton>

                    <div>
                        <p className='font-semibold text-lg' >{league?.title}</p>
                    </div>
                </div>

                <JoinOrInviteButton />
            </div>
        </div>
    )
}
