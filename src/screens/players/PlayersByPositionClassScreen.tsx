import { ChevronDown, Users } from 'lucide-react';
import { useParams } from 'react-router-dom'
import PageView from '../PageView';
import RoundedCard from '../../components/shared/RoundedCard';
import { formatPosition } from '../../utils/athleteUtils';

export default function PlayersByPositionClassScreen() {

    const { positionClass } = useParams();

    return (
        <PageView className='px-4' >

            <div className='flex flex-row items-center justify-between' >
                <div className='flex flex-row items-center gap-2' >
                    <Users />
                    <p className='font-bold' >Players</p>
                </div>

                <div>
                    <RoundedCard className='w-fit py-2 cursor-pointer px-3 rounded-md flex flex-row items-center gap-2' >
                        <p className='text-sm' >{formatPosition(positionClass)}</p>
                        <ChevronDown className='w-4 h-4' />
                    </RoundedCard>
                </div>
            </div>


        </PageView>
    )
}
