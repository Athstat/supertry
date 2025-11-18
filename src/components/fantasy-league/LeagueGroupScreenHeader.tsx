import { ArrowLeft, Share2 } from 'lucide-react'
import PrimaryButton from '../shared/buttons/PrimaryButton'
import JoinLeagueButton from './buttons/JoinLeagueButton'
import { useNavigate } from 'react-router-dom';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { useShareLeague } from '../../hooks/leagues/useShareLeague';

type Props = {
    isEditing?: boolean
}

/** Renders a header component on the fantasy league group header */
export default function LeagueGroupScreenHeader({isEditing} : Props) {

    const navigate = useNavigate();
    const { league, isMember } = useFantasyLeagueGroup();
    const { handleShare } = useShareLeague(league);

    const handleBackToLeagues = () => {
        navigate(`/leagues`);
    }

    if (!league) {
        return;
    }

    return (
        <div className="flex flex-col px-4 pt-4">
            <div className="flex flex-row items-start justify-between gap-2">

                <div className="flex flex-col items-start justify-center gap-2">
                    <div className="flex flex-row items-center gap-2">
                        
                        <button onClick={handleBackToLeagues} >
                            <ArrowLeft />
                        </button>

                        {/* {isOfficialLeague ? <Globe /> : <Trophy />} */}
                        <p className="font-bold text-xl">{league?.title}</p>
                    </div>
                    {/* <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
                        {currentRound?.title}
                    </p> */}
                </div>

                {!isEditing && (
                    <div>
                        {!isMember && <JoinLeagueButton league={league} />}

                        {isMember && (
                            <PrimaryButton onClick={handleShare}>
                                {/* <Plus className="w-4 h-4" /> */}
                                <Share2 className="w-4 h-4" />
                                Invite
                            </PrimaryButton>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
