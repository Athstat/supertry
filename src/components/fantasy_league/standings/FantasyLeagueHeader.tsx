import { ArrowLeft } from 'lucide-react'
import CircleButton from '../../ui/buttons/BackButton'
import { JoinOrInviteButton } from '../buttons/JoinLeagueButton'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'
import { twMerge } from 'tailwind-merge'
import { AppColours } from '../../../types/constants'
import LeagueGroupBanner from '../LeagueGroupBanner'
import LeagueGroupLogo from '../LeagueGroupLogo'

type Props = {
    handleBack?: () => void
}

/** Renders a fantasy league standings header */
export default function FantasyLeagueHeader({ handleBack }: Props) {

    const { league } = useFantasyLeagueGroup();

    return (
        <div className="flex flex-col relative min-h-[40px]" >

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

            <div className='absolute -bottom-3 left-5' >
                <LeagueGroupLogo className='w-16 h-16 dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)]' league={league} />
            </div>
        </div>
    )
}
