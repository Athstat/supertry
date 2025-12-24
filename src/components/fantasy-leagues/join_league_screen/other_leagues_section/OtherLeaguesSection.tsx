import { Trophy } from 'lucide-react'
import { useJoinableLeagues } from '../../../../hooks/leagues/useJoinableLeagues'
import { JoinLeagueCard } from '../../../JoinLeagueCard';
import { IFantasySeason } from '../../../../types/fantasy/fantasySeason';
import SecondaryText from '../../../shared/SecondaryText';
import RoundedCard from '../../../shared/RoundedCard';
import { useMemo } from 'react';

type Props = {
    fantasySeason: IFantasySeason
}

/** Renders other leagues that the user can join */
export default function OtherLeaguesSection({ fantasySeason }: Props) {


    const { joinableLeagues: leagues, isLoading } = useJoinableLeagues(fantasySeason.id);

    const trimmedList = useMemo(() => {
        return [...leagues].slice(0, 5);
    }, [leagues]);

    if (isLoading) {
        return (
            <LoadingSkeleton />
        )
    }

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