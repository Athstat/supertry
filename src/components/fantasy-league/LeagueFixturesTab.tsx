import { forwardRef, RefObject, useEffect, useRef } from 'react'
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup'
import { Calendar } from 'lucide-react';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { twMerge } from 'tailwind-merge';

export default function LeagueFixturesTab() {

    const { sortedRounds, currentRound } = useFantasyLeagueGroup();
    const currRoundRef = useRef<HTMLDivElement>();

    useEffect(() => {

        if (currRoundRef) {
            currRoundRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }

    }, [currRoundRef, currentRound]);

    return (
        <div className='flex flex-col gap-2' >
            <div className='flex flex-row items-center gap-2' >
                <Calendar className='' />
                <p className='font-bold text-xl' >Fixtures</p>
            </div>


            <div className='flex flex-row items-center gap-2 flex-nowrap overflow-x-auto no-scrollbar' >
                {sortedRounds.map((round) => {
                    return <RoundListItem
                        round={round}
                        key={round.id}
                        ref={round.id === currentRound?.id ? currRoundRef : undefined}
                        isCurrent={round.id === currentRound?.id }
                    />
                })}
            </div>
        </div>
    )
}

type ListItemProps = {
    round: IFantasyLeagueRound,
    isCurrent?: boolean
}

const RoundListItem = forwardRef(({ round, isCurrent }: ListItemProps, ref) => {
    return (
        <div 
            ref={ref as RefObject<HTMLDivElement>} 
            className={twMerge(
                'flex flex-row text-nowrap cursor-pointer text-slate-800 dark:text-slate-400 px-3 py-1 rounded-xl text-sm bg-slate-200 dark:bg-slate-800 ',
                isCurrent && "bg-blue-500 text-white dark:bg-blue-500 dark:text-white"
            )}
        >
            <p className='' >{round.title}</p>
        </div>
    )
})
