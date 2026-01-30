import { ArrowUpRight, Trophy } from 'lucide-react'
import { useMemo } from 'react';
import { useSuggestedLeagues } from '../../../hooks/leagues/useSuggestedLeagues';
import { IFantasySeason } from '../../../types/fantasy/fantasySeason';
import { JoinLeagueCard } from '../card/JoinLeagueCard';
import SecondaryText from '../../ui/typography/SecondaryText';
import RoundedCard from '../../ui/cards/RoundedCard';
import { useNavigate } from 'react-router-dom';

type Props = {
    fantasySeason: IFantasySeason
}

/** Renders other leagues that the user can join */
export default function SuggestedLeaguesSections({ fantasySeason }: Props) {

    const navigate = useNavigate();
    const { joinableLeagues: leagues, isLoading } = useSuggestedLeagues(fantasySeason.id);

    const trimmedList = useMemo(() => {
        return [...leagues].filter((l) => {
            return l.type !== 'system_created';
        }).slice(0, 5);
    }, [leagues]);

    const handleDiscoverMore = () => {
        navigate('/leagues/discover');
    }

    if (isLoading) {
        return (
            <LoadingSkeleton />
        )
    }

    if (leagues.length === 0) {
        return;
    }

    return (
        <div className='flex flex-col gap-2 px-4' >

            <div className='flex flex-row items-center justify-between gap-2' >
                <div className="flex flex-col" >
                    <p className="font-semibold" >Discover More Leagues</p>
                    <SecondaryText>Public Leagues that you can join</SecondaryText>
                </div>

                <button onClick={handleDiscoverMore} >
                    <ArrowUpRight />
                </button>
            </div>

            <div className='flex flex-col gap-2 mt-2' >
                {trimmedList.map((l) => {
                    return (
                        <JoinLeagueCard
                            leagueGroup={l}
                            key={l.id}
                        />
                    )
                })}
            </div>
        </div>
    )
}


function LoadingSkeleton() {
    return (
        <div className='flex flex-col gap-2' >
            <div className="flex flex-row items-center gap-2" >
                <Trophy className="w-4 h-4" />
                <p className="text-lg font-bold" >Other Leagues</p>
                {/* <GamePlayHelpButton className="" iconHw="w-4 h-4" /> */}
            </div>

            <div>
                <SecondaryText>Public Leagues that you can join</SecondaryText>
            </div>

            <div className='flex flex-col animate-pulse gap-2 mt-2' >
                <RoundedCard className='h-[40px] w-full border-none' />
                <RoundedCard className='h-[40px] w-full border-none' />
                <RoundedCard className='h-[40px] w-full border-none' />
                <RoundedCard className='h-[40px] w-full border-none' />
                <RoundedCard className='h-[40px] w-full border-none' />
            </div>
        </div>
    )
}

