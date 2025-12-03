import PageView from '../PageView'
import { ArrowLeft } from 'lucide-react'
import CircleButton from '../../components/shared/buttons/BackButton'
import { useSupportedAthletes } from '../../hooks/athletes/useSupportedAthletes'
import PlayersList from '../../components/players/PlayersList';

export default function AllPlayersScreen() {

    const {athletes} = useSupportedAthletes();

    return (
        <PageView className='px-4' >

            <div className='flex flex-row items-center gap-2' >
                <CircleButton>
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
