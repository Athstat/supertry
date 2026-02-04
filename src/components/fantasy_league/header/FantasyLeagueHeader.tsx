import { ArrowLeft, Edit2 } from 'lucide-react'
import CircleButton from '../../ui/buttons/BackButton'
import { JoinOrInviteButton } from '../buttons/JoinLeagueButton'
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup'
import { twMerge } from 'tailwind-merge'
import { AppColours } from '../../../types/constants'
import LeagueGroupBanner from '../LeagueGroupBanner'
import LeagueGroupLogo from '../LeagueGroupLogo'
import { useFantasyLeagueScreen } from '../../../hooks/fantasy/useFantasyLeagueScreen'
import { LeagueGoldCheckMark } from '../../fantasy-leagues/card/LeagueBadge'

type Props = {
    handleBack?: () => void
}

/** Renders a fantasy league standings header */
export default function FantasyLeagueHeader({ handleBack }: Props) {
    const { league, isCommissioner } = useFantasyLeagueGroup();
    const {toggleEditBanner, toggleEditLogo} = useFantasyLeagueScreen();

    return (
        <div className='relative'>
            <div key={league?.id} className="flex flex-col relative min-h-[40px]" >

                <LeagueGroupBanner league={league} />

                <div className={twMerge(
                    'flex absolute top-0 left-0 w-full pt-2 px-2 flex-row items-center justify-between pb-4',
                    'bg-gradient-to-b to-transparent',
                    AppColours.BACKGROUND_GRADIENT,
                )} >
                    <div className='flex flex-row items-center gap-2' >
                        <CircleButton
                            onClick={handleBack}
                        >
                            <ArrowLeft />
                        </CircleButton>

                        <div className='flex flex-row items-center gap-1' >
                            <p className='font-semibold text-lg' >{league?.title}</p>
                            <LeagueGoldCheckMark clickable size='20' fill='white' leagueGroup={league} />
                        </div>
                    </div>

                    <div className='flex flex-row items-center gap-2' >
                        <JoinOrInviteButton />

                       {isCommissioner && <CircleButton 
                            className='text-white w-9 h-9 dark:text-white bg-blue-600 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-700 border border-primary-500 dark:border-primary-500' 
                            onClick={toggleEditBanner}
                        >
                            <Edit2 className='w-5 h-5' />
                        </CircleButton>}

                    </div>
                </div>

                <div className='absolute -bottom-3 left-5' >
                    
                    <LeagueGroupLogo 
                        isEditable={isCommissioner}
                        className='w-16 h-16 dark:drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)]'
                        league={league} 
                        onEdit={toggleEditLogo}
                    />

                </div>
            </div>
        </div>
    )
}
