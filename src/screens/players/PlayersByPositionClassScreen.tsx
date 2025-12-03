import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom'
import PageView from '../PageView';
import RoundedCard from '../../components/shared/RoundedCard';
import { formatPosition } from '../../utils/athleteUtils';
import CircleButton from '../../components/shared/buttons/BackButton';
import PlayersPositionsSheet from '../../components/players/positioning/PlayersPositionsSheet';
import { useMemo, useState } from 'react';
import PlayersList from '../../components/players/PlayersList';
import { useSupportedAthletes } from '../../hooks/athletes/useSupportedAthletes';
import { twMerge } from 'tailwind-merge';
import { backgroundTranslucentCN } from '../../types/constants';

export default function PlayersByPositionClassScreen() {

    const { positionClass } = useParams();
    const navigate = useNavigate();

    const [showSheet, setShowSheet] = useState<boolean>(false);
    const toggle = () => setShowSheet(prev => !prev);

    const {athletes} = useSupportedAthletes();

    const positionPlayers = useMemo(() => {
        return athletes.filter((a) => {
            return a.position_class === positionClass;
        })
    }, [athletes, positionClass]);

    const handleBack = () => {
        navigate("/players")
    }

    return (
        <PageView className='px-4 relative' >

            <div className={twMerge(
                'flex sticky w-full p-2 top-16 z-[10] left-0 flex-row items-center justify-between',
                backgroundTranslucentCN
            )} >
                <div className='flex flex-row items-center gap-2' >
                    <CircleButton
                        onClick={handleBack}
                    >
                        <ArrowLeft />
                    </CircleButton>
                    <p className='font-bold' >Players By Position</p>
                </div>

                <div>
                    <RoundedCard
                        onClick={toggle}
                        className='w-fit py-2 cursor-pointer px-3 rounded-md flex flex-row items-center gap-2'
                    >
                        <p className='text-sm' >{formatPosition(positionClass)}</p>
                        <ChevronDown className='w-4 h-4' />
                    </RoundedCard>
                </div>
            </div>

            <PlayersList 
                players={positionPlayers}
            />

            <PlayersPositionsSheet
                isOpen={showSheet}
                onClose={toggle}
            />


        </PageView>
    )
}
