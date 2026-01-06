import { ArrowLeft } from 'lucide-react'
import { JoinOrInviteButton } from './buttons/JoinLeagueButton'
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import CircleButton from '../shared/buttons/BackButton';
import { useNavigateBack } from '../../hooks/web/useNavigateBack';


/** Renders a header component on the fantasy league group header */
export default function MyFantasyTeamScreenHeader() {

    const {hardPop} = useNavigateBack();

    const { league } = useFantasyLeagueGroup();

    const handleBackToLeagues = () => {
        // navigate("/leagues");
        hardPop("/leagues");
    }

    if (!league) {
        return;
    }

    return (
        <div className="flex flex-col px-4 pt-6">

            <div className="flex relative flex-row items-center justify-center gap-2">

                <div className="flex absolute left-0 flex-col items-start justify-center gap-2">

                    <CircleButton onClick={handleBackToLeagues} >
                        <ArrowLeft className='w-4 h-4' />
                    </CircleButton>

                </div>

                <div>
                    <p className="font-semibold text-md">My Team</p>
                </div>

                <div className='absolute right-0' >
                    <JoinOrInviteButton />
                </div>
            </div>

        </div>
    )
}