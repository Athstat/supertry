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
    destroy?: boolean
}
export default function PrimaryButton({ children, className, onClick, disbabled, isLoading = false, type, disabled, destroy }: Props) {

    const handleOnClick = () => {
        if (onClick) {
            onClick();
        }
    }

    return (
        <button
            disabled={disbabled || disabled}
            className={twMerge(
                "bg-blue-600 dark:bg-blue-600 text-white font-medium px-4 py-2 w-full items-center justify-center flex rounded-xl",
                "hover:bg-blue-700 dark:hover:bg-blue-700",
                "border border-primary-500 text-sm lg:text-base",
                destroy && "bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 border-red-500",
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
export function TranslucentButton(props : Props) {
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