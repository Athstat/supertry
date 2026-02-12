import { Loader } from "lucide-react"
import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
    children?: ReactNode,
    className?: string,
    onClick?: () => void,
    disbabled?: boolean,
    disabled?: boolean,
    isLoading?: boolean,
    type?: "submit" | "reset" | "button" | undefined,
    destroy?: boolean,
    slate?: boolean
}
export default function PrimaryButton({ children, className, onClick, disbabled, isLoading = false, type, disabled, destroy, slate }: Props) {

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return (
        <button
            disabled={disbabled || disabled}
            className={twMerge(
                "bg-primary-600 dark:bg-primary-600 text-white font-medium px-4 py-2 w-full items-center justify-center flex rounded-xl",
                "hover:bg-primary-700 dark:hover:bg-primary-700",
                "border border-primary-500 text-sm lg:text-base",
                destroy && "bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 border-red-500",
                slate && "bg-slate-600 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-700 border-slate-500",
                className,
                (disbabled || disabled) && "opacity-40 cursor-not-allowed",
                isLoading && 'animate-pulse'
            )}
            onClick={handleOnClick}

            type={type}
        >
            <div className='flex flex-row items-center gap-1' >
                {children}
                {isLoading && <Loader className="animate-spin w-4 h-4" />}
            </div>
        </button>
    )
}

/** Renders a trnaslucent button */
export function TranslucentButton(props: Props) {
    return (
        <PrimaryButton
            onClick={props.onClick}
            disabled={props.disabled}
            disbabled={props.disbabled}
            isLoading={props.isLoading}
            type={props.type}
            className={twMerge(
                'bg-blue-100/10 dark:bg-blue-100/10  border-white/20 ',
                'hover:bg-blue-100/20 hover:dark:bg-blue-100/20',
                props.className
            )}
        >
            {props.children}
        </PrimaryButton>
    )
}

/** Renders outlines button */
export function OutlinedButton(props: Props) {
    return (
        <PrimaryButton
            onClick={props.onClick}
            disabled={props.disabled}
            disbabled={props.disbabled}
            isLoading={props.isLoading}
            type={props.type}
            className={twMerge(
                "bg-transparent dark:bg-transparent hover:bg-transparent dark:border-white/60 border-slate-400 text-slate-600 dark:text-white",
                props.className
            )}
        >
            {props.children}
        </PrimaryButton>
    )
}