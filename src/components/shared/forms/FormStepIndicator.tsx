import { CircleCheck } from 'lucide-react'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type Props = {
    icon?: ReactNode,
    isCurrent?: boolean,
    isCompleted?: boolean,
    label?: string
}

/** Renders a form step check */
export default function FormStepIndicator({icon, isCompleted, isCurrent, label} : Props) {
    return (
        <div>
            <div className='flex flex-col items-center gap-1' >
                <div className={twMerge(
                    'bg-slate-300 dark:bg-slate-700/70 text-white w-10 h-10 items-center justify-center flex flex-row rounded-full',
                    isCurrent && 'bg-blue-500 dark:bg-blue-600',
                    isCompleted && 'bg-green-500 dark:bg-green-600'
                )} >
                    {isCompleted ? <CircleCheck /> : icon}
                </div>

                <p className='text-xs' >{label}</p>
            </div>
        </div>
    )
}
