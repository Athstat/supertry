import { twMerge } from 'tailwind-merge'
import { SeasonFilterBarItem } from '../../types/games'
import { abbreviateSeasonName } from '../players/compare/PlayerCompareSeasonPicker'
import RoundedCard from '../ui/cards/RoundedCard'

type Props = {
    seasons: SeasonFilterBarItem[],
    onChange?: (newVal: string) => void,
    value?: string,
    hideAllOption?: boolean,
    isLoading?: boolean,
    sortDesc?: boolean
}

/** Renders a filter bar that can be used to filter out seasons */
export default function MatchSeasonFilterBar({ onChange, seasons, value, sortDesc }: Props) {

    const handleChange = (val: string) => {
        if (onChange) {
            onChange(val);
        }
    }

    seasons = seasons.sort((a, b) => {
        if (sortDesc) {
            return b.name.localeCompare(a.name);
        }
        
        return a.name.localeCompare(b.name);
    })

    return (
        <div className="flex flex-row items-center no-scrollbar overflow-y-auto gap-2" >

            <RoundedCard
                className={twMerge(
                    "w-fit px-4 cursor-pointer text-nowrap py-2 rounded-lg",
                    value === 'all' && "bg-blue-500 text-white hover:dark:bg-blue-600 hover:bg-blue-600  dark:bg-blue-600 border-blue-400 dark:border-blue-400"
                )}
                onClick={() => handleChange('all')}
            >
                {'All'}
            </RoundedCard>

            {seasons.map((c) => {
                return (
                    <RoundedCard
                        key={c.id}
                        className={twMerge(
                            "w-fit px-4 cursor-pointer text-nowrap py-2 rounded-lg",
                            value === c.id && "bg-blue-500 text-white hover:dark:bg-blue-600 hover:bg-blue-600  dark:bg-blue-600 border-blue-400 dark:border-blue-400"
                        )}
                        onClick={() => handleChange(c.id)}
                    >
                        {c.name}
                    </RoundedCard>
                )
            })}
        </div>
    )
}

export function PilledSeasonFilterBar({ onChange, seasons, value, hideAllOption, isLoading, sortDesc }: Props) {

    const handleChange = (val: string) => {
        if (onChange) {
            onChange(val);
        }
    }

    seasons = seasons.sort((a, b) => {
        if (sortDesc) {
            return b.name.localeCompare(a.name);
        }
        
        return a.name.localeCompare(b.name);
    })

    if (isLoading) {
        return (
            <div className="flex flex-row items-center overflow-y-auto gap-2" >

                <div
                    className={twMerge(
                        "w-20 h-6 animate-pulse bg-slate-200 dark:bg-slate-700/20 cursor-pointer text-nowrap py-0.5 hide-scrollbar rounded-xl",
                    )}
                >
                </div>
                <div
                    className={twMerge(
                        "w-28 h-6 animate-pulse bg-slate-200 dark:bg-slate-700/20 cursor-pointer text-nowrap py-0.5 hide-scrollbar rounded-xl",
                    )}
                >
                </div>
                <div
                    className={twMerge(
                        "w-16 h-6 animate-pulse bg-slate-200 dark:bg-slate-700/20 cursor-pointer text-nowrap py-0.5 hide-scrollbar rounded-xl",
                    )}
                >
                </div>
                <div
                    className={twMerge(
                        "w-20 h-6 animate-pulse bg-slate-200 dark:bg-slate-700/20 cursor-pointer text-nowrap py-0.5 hide-scrollbar rounded-xl",
                    )}
                >
                </div>


            </div>
        )
    }

    if (seasons.length === 0) { return; }

    return (
        <div className="flex flex-row items-center overflow-y-auto gap-2" >

            {!hideAllOption && <RoundedCard
                className={twMerge(
                    "w-fit px-2 cursor-pointer text-nowrap py-0.5 hide-scrollbar rounded-xl",
                    value === 'all' && "bg-blue-500 text-white hover:dark:bg-blue-600 hover:bg-blue-600  dark:bg-blue-600 border-blue-400 dark:border-blue-400"
                )}
                onClick={() => handleChange('all')}
            >
                <p className='text-sm' >
                    {'All'}
                </p>
            </RoundedCard>}

            {seasons.map((c) => {
                return (
                    <RoundedCard
                        key={c.id}
                        className={twMerge(
                            "w-fit text-sm px-2 cursor-pointer text-nowrap py-0.5 rounded-xl",
                            value === c.id && "bg-blue-500 text-white hover:dark:bg-blue-600 hover:bg-blue-600  dark:bg-blue-600 border-blue-400 dark:border-blue-400"
                        )}
                        onClick={() => handleChange(c.id)}
                    >
                        {abbreviateSeasonName(c.name)}
                    </RoundedCard>
                )
            })}
        </div>
    )
}

