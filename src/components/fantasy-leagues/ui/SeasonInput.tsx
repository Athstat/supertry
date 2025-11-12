import { twMerge } from 'tailwind-merge';
import { IProSeason } from '../../../types/season'
import { abbreviateSeasonName } from '../../players/compare/PlayerCompareSeasonPicker';
import { Trophy } from 'lucide-react';

type Props = {
    options: IProSeason[],
    value?: IProSeason,
    onChange: (s: IProSeason) => void
}

export default function SeasonInput({ options, value, onChange }: Props) {
    return (
        <div className='dark:text-white' >
            <label>Season</label>

            <div className="flex flex-row no-scrollbar items-center flex-nowrap gap-2 overflow-x-auto" >
                {options.map((season) => {

                    const isSelected = value?.id === season.id;

                    const handleSelect = () => {
                        onChange(season);
                    }

                    return (
                        <div
                            className={twMerge(
                                "flex flex-col gap-2 flex-1 min-w-[250px]  flex-nowrap p-5 border-2 cursor-pointer border-slate-200 dark:border-slate-700 rounded-lg",
                                isSelected && "border-primary-500 dark:border-primary-700 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/40 hover:dark:bg-primary-900/60",
                                !isSelected && "hover:bg-slate-100 hover:dark:bg-slate-800"
                            )}
                            onClick={handleSelect}
                        >


                            <div className="flex flex-row items-center gap-2 justify-between" >

                                <div className="flex flex-row truncate items-center gap-2" >
                                    <Trophy
                                    />
                                    <p className={twMerge(
                                        // isSelected && "text-blue-500 font-bold"
                                        "truncate"
                                    )} >{season.name ? abbreviateSeasonName(season.name) : ''}</p>
                                </div>

                                <div className={twMerge(
                                    "w-5 h-5 rounded-full border border-slate-600 dark:border-slate-400",
                                    isSelected && "border-primary-500 dark:border-primary-600 p-[4px] flex flex-col items-center justify-center"
                                )} >
                                    {isSelected && <div className="bg-primary-500 dark:bg-primary-600 w-full h-full rounded-full" ></div>}
                                </div>
                            </div>

                            {/* <div className='flex flex-col gap-1' >
                                <SecondaryText className={twMerge(
                                    // isSelected && 'text-blue-500'
                                )} >{season.start_date ? `Starts ${format(season.start_date, 'MMMM yyyy')}` : ''}</SecondaryText>

                                <SecondaryText className={twMerge(
                                    // isSelected && 'text-blue-500'
                                )} >{season.end_date ? `Ends ${format(season.end_date, 'MMMM yyyy')}` : ''}</SecondaryText>
                            </div> */}
                        </div>
                    )
                })}
            </div>

        </div>
    )
}
