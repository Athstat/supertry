import { twMerge } from 'tailwind-merge'
import SecondaryText from '../../shared/SecondaryText'

type Props = {
    value?: string,
    label?: string,
    className?: string
}

/** Renders a player info small card */
export default function PlayerInfoCard({value, label, className} : Props) {
    
    return (
        <div className={
            twMerge(
                'bg-slate-200 flex-1 rounded-xl p-3 dark:bg-slate-700/80',
                className
            )
        } >
            <p className='font-semibold dark:text-white' >{value}</p>
            <SecondaryText className='text-xs truncate dark:text-slate-300' >{label}</SecondaryText>
        </div>
    )
}
