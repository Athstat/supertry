import { Share2 } from 'lucide-react';
import PrimaryButton from '../../ui/buttons/PrimaryButton'
import { useState } from 'react';
import LeagueInviteModal from '../LeagueInviteModal';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';

/** Renders Invite Button */
export default function LeagueInviteButton() {

    const {league} = useFantasyLeagueGroup();
    const [showInviteModal, setInviteShowModal] = useState<boolean>(false);
    const toggle = () => setInviteShowModal(prev => !prev);

    return (
        <>
            <PrimaryButton onClick={toggle} className='text-xs' >
                <Share2 className="w-4 h-4" />
                Invite
            </PrimaryButton>

            {league && <LeagueInviteModal 
                onClose={toggle} 
                isOpen={showInviteModal}
                league={league}
            />}
        </>
    )
}
