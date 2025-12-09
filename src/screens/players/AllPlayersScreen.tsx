import PageView from '../PageView'
import { ArrowLeft } from 'lucide-react'
import CircleButton from '../../components/shared/buttons/BackButton'
import { useSupportedAthletes } from '../../hooks/athletes/useSupportedAthletes'
import PlayersList from '../../components/players/PlayersList';
import { useNavigate } from 'react-router-dom';

export default function AllPlayersScreen() {

    const {athletes} = useSupportedAthletes();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/players`);
    }

    return (
        <PageView className='px-4 flex flex-col gap-4' >

            <div className='flex flex-row items-center gap-2' >
                <CircleButton
                    onClick={handleBack}
                >
                    <ArrowLeft className='w-5 h-5' />
                </CircleButton>

                <p className='font-bold ' >All Players</p>
            </div>

            <PlayersList 
                players={athletes}
            />
            
        </PageView>
    )
}
