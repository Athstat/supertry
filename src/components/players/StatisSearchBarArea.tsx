import { Search, Filter, User, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import PrimaryButton from '../ui/buttons/PrimaryButton';
import { usePlayerCompareActions } from '../../hooks/usePlayerCompare';
import RoundedCard from '../ui/cards/RoundedCard';
import { Activity, Fragment } from 'react';
import SecondaryText from '../ui/typography/SecondaryText';
import { AppColours } from '../../types/constants';
import { useInView } from 'react-intersection-observer';

type Props = {
    value: string;
    onChange: (v: string) => void;
    onOpenControls?: () => void;
    onOpenCompare?: () => void;
    isComparePicking?: boolean;
    placeholder?: string;
    className?: string;
    showFilterButton?: boolean;
    showCompareButton?: boolean;
    stickyHeaderClassName?: string
};

export default function StaticSearchBarArea({
    value,
    onChange,
    onOpenControls,
    isComparePicking,
    placeholder = 'Search players...',
    showFilterButton = true,
    showCompareButton = true,
    stickyHeaderClassName
}: Props) {


    const { ref: sentinelRef, inView } = useInView();
    const { stopPicking, startPicking, isPicking } = usePlayerCompareActions();

    // Simplified color classes for opaque backgrounds
    const iconColorClass = 'text-slate-700 dark:text-white';
    const textColorClass = 'text-slate-800 dark:text-white';
    const placeholderColorClass = 'placeholder:text-slate-500 dark:placeholder:text-slate-400';

    return (
        <Fragment>

            <div className={twMerge(
                'sticky top-0 left-0 z-[20] py-2 pb-2 w-full flex flex-col gap-2',
                !inView && "border-b dark:border-slate-700",
                AppColours.BACKGROUND,
                stickyHeaderClassName,
            )} >

                <RoundedCard
                    className={twMerge(
                        'flex p-2 border rounded-full dark:border-slate-600 flex-row items-center gap-2 h-[43px] px-4'
                    )}
                >
                    <Search className={`w-5 h-5 ${iconColorClass}`} />
                    <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder={placeholder}
                        className={twMerge(
                            `flex-1 bg-transparent outline-none text-base ${textColorClass} ${placeholderColorClass}`,
                            
                        )}
                    />
                </RoundedCard>

                <div className='flex flex-row cursor-pointer items-center gap-2' >
                    {showFilterButton && (
                        <RoundedCard
                            aria-label="Open filters and sorting"
                            onClick={onOpenControls}
                            className={[
                                'flex border hover:bg-slate-100 dark:border-slate-600 flex-row items-center gap-2 rounded-2xl h-[32px] px-4'
                            ].join(' ')}
                        >
                            <p>Filters</p>
                            <Filter className={`w-5 h-5 ${iconColorClass}`} />
                        </RoundedCard>
                    )}

                    {showCompareButton && (
                        <button
                            aria-label="Enter compare mode"
                            className={[
                                // Size differs when showing two icons vs. single arrow
                                '',
                                'flex items-center justify-center gap-2',
                                // Style changes with compare mode
                                'active:scale-[0.98]',
                                'transition',
                            ].join(' ')}
                        >
                            {isComparePicking ? (
                                <div className='flex flex-row items-center gap-2' >
                                    <PrimaryButton onClick={stopPicking} destroy className='flex flex-row items-center gap-2 rounded-2xl h-[32px] px-4' >
                                        <p>Cancel Compare</p>
                                        <X className="w-5 h-5 text-white" />
                                    </PrimaryButton>
                                </div>
                            ) : (
                                <RoundedCard onClick={startPicking} className='flex border dark:border-slate-600 flex-row items-center gap-2 rounded-2xl h-[32px] px-4' >
                                    <p>Compare Players</p>
                                    <div className='flex flex-row items-center' >
                                        <User className={`w-5 h-5 ${iconColorClass}`} />
                                        <span className="text-slate-400 dark:text-slate-500">|</span>
                                        <User className={`w-5 h-5 ${iconColorClass}`} />
                                    </div>
                                </RoundedCard>
                            )}
                        </button>
                    )}
                </div>

                <Activity mode={isPicking ? 'visible' : 'hidden'} >
                    <SecondaryText>Select players that you want to compare (MAX 5).</SecondaryText>
                </Activity>

            </div>

            <div ref={sentinelRef} className="h-px" />
        </Fragment>

    );
}
