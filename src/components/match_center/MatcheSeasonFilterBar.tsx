import { twMerge } from 'tailwind-merge'
import RoundedCard from '../shared/RoundedCard'
import { SeasonFilterBarItem } from '../../types/games'

type Props = {
    seasons: SeasonFilterBarItem[],
    onChange?: (newVal: string) => void,
    value?: string
}

/** Renders a filter bar that can be used to filter out seasons */
export default function MatchSeasonFilterBar({onChange, seasons, value} : Props) {
    
    const handleChange = (val: string) => {
        if (onChange) {
            onChange(val);
        }
    }
    
    return (
        <div className="flex flex-row items-center overflow-y-auto gap-2" >

            <RoundedCard
                className={twMerge(
                    "w-fit px-4 cursor-pointer text-nowrap py-2 rounded-lg",
                    value === 'all' && "bg-blue-500 hover:dark:bg-blue-600 hover:bg-blue-600  dark:bg-blue-600 border-blue-400 dark:border-blue-400"
                )}
                onClick={() => handleChange('all')}
            >
                {'All'}
            </RoundedCard>

            {seasons.map((c) => {
                return (
                    <RoundedCard
                        className={twMerge(
                            "w-fit px-4 cursor-pointer text-nowrap py-2 rounded-lg",
                            value === c.id && "bg-blue-500 hover:dark:bg-blue-600 hover:bg-blue-600  dark:bg-blue-600 border-blue-400 dark:border-blue-400"
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
