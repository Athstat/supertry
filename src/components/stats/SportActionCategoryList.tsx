import { useMemo } from 'react'
import { SportAction } from '../../types/sports_actions'
import { shouldShowSportAction } from '../../utils/sportsActionUtils';
import SecondaryText from '../shared/SecondaryText';

type Props = {
    categoryName: string,
    stats: SportAction[]
}


/** Renders List of Sports Actions under a specific category */
export default function SportActionCategoryList({ categoryName, stats }: Props) {

    const categoryActions = useMemo(() => {
        
        return stats.filter((s) => {
            return s.definition?.category === categoryName
        }).filter(s => shouldShowSportAction(s));

    }, [stats, categoryName]);


    if (categoryActions.length === 0) {
        return;
    }

    if (categoryName === "Tactical Kicking" ) {
        console.log(categoryName, categoryActions);
    }

    return (
        <div className='flex flex-col gap-2' >
            <div>
                <p className='font-semibold' >{categoryName}</p>
            </div>

            <div className='flex flex-col gap-2' >
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

function ActionItem({sportAction} : ItemProps) {

    const shouldShow = shouldShowSportAction(sportAction);
    const {definition, action_count} = sportAction;

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
        <div className='hover:bg-slate-300/40 cursor-pointer px-4 py-1 rounded-xl flex flex-row items-center justify-between' >
            <div>
                <SecondaryText className='' >{definition?.display_name}</SecondaryText>
            </div>

            <div>
                <p>{processActionCount()}</p>
            </div>
        </div>
    )
}
