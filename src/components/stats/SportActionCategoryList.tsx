import { useMemo, useRef, useState } from 'react'
import { SportAction } from '../../types/sports_actions'
import { shouldShowSportAction } from '../../utils/sportsActionUtils';
import SecondaryText from '../shared/SecondaryText';
import { useClickOutside } from '../../hooks/useClickOutside';
import { useHoverCoordinates } from '../../hooks/useSmartMouseHover';
import TooltipCard from '../shared/Tooltip';
import { useSportActions } from './SportActionsDefinitionsProvider';

type Props = {
    categoryName: string,
    stats: SportAction[]
    forceCanonicalOrder?: boolean
}


/** Renders List of Sports Actions under a specific category */
export default function SportActionCategoryList({ categoryName, stats, forceCanonicalOrder }: Props) {

    const { uiDefintions } = useSportActions();

    const categoryActions = useMemo(() => {
        // Normal flow: filter and sort by display name
        const filtered = stats
            .filter((s) => s.definition?.category === categoryName)
            .filter(s => shouldShowSportAction(s));

        if (!forceCanonicalOrder) {
            return filtered.sort((a, b) => {
                const an = a.definition?.display_name ?? '';
                const bn = b.definition?.display_name ?? '';
                return an.localeCompare(bn);
            });
        }

        // Canonical order flow: use global definitions to build a fixed list
        const defs = uiDefintions
            .filter(d => d.category === categoryName)
            .sort((a, b) => (a.display_name ?? '').localeCompare(b.display_name ?? ''));

        return defs.map(def => {
            const found = filtered.find(s => s.definition?.action_name === def.action_name);
            if (found) return found;

            // Create a zero-filled placeholder for missing stats
            const placeholder: SportAction = {
                athlete_id: '',
                action: '' as any,
                action_count: 0,
                season_id: '',
                // @ts-expect-error not needed for display
                season: undefined,
                definition: def,
            };
            return placeholder;
        });
    }, [stats, categoryName, forceCanonicalOrder, uiDefintions]);


    if (categoryActions.length === 0) {
        return;
    }

    // remove noisy logs

    return (
        <div className='flex flex-col gap-2'>
            <div>
                <p className='font-semibold' >{categoryName}</p>
            </div>

            <div className='flex flex-col gap-2'>
                {categoryActions.map((s, index) => {
                    return <ActionItem sportAction={s} key={index} />
                })}
            </div>
        </div>
    )
}

type ItemProps = {
    sportAction: SportAction
}

function ActionItem({ sportAction }: ItemProps) {

    const shouldShow = shouldShowSportAction(sportAction);
    const { definition, action_count } = sportAction;
    const ref = useRef<HTMLDivElement>(null);

    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    const { coordinates, handleMouseEnter } = useHoverCoordinates(
        () => { },
        () => { }
    );

    const toggleTooltip = (e: React.MouseEvent) => {
        setShowTooltip(prev => !prev);
        handleMouseEnter(e);
    }

    useClickOutside(ref, () => {
        setShowTooltip(false);
    });

    if (!shouldShow) {
        return;
    }


    const processActionCount = () => {
        if (action_count && !isNaN(Number(action_count))) {
            const isPercentage = action_count && action_count.toString().startsWith("0.")
            if (isPercentage) {
                return `${Math.floor(Number(action_count) * 100)}%`
            }

            return Math.floor(Number(action_count))
        }

        return undefined;
    }

    return (
        <div>

            <div
                ref={ref}
                onClick={toggleTooltip}
                onMouseEnter={(e) => {
                    setShowTooltip(true);
                    handleMouseEnter(e);
                }}
                onMouseLeave={() => setShowTooltip(false)}
                className='hover:bg-slate-300/40 dark:hover:bg-slate-600 cursor-pointer px-0 py-1 rounded-xl flex flex-row items-center justify-between'
            >

                <div className='text-left'>
                    <SecondaryText className=''>
                        {definition?.display_name}
                    </SecondaryText>
                </div>

                <div className='text-left'>
                    <p>{processActionCount() ?? 0}</p>
                </div>
            </div>

            <TooltipCard
                showTooltip={showTooltip}
                title={definition?.display_name}
                text={definition?.tooltip}
                coordinates={coordinates}
            />

        </div>
    )
}
