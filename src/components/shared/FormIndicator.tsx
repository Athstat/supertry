import { Check, Info} from "lucide-react";
import { ArrowDownRightIcon, FlameIcon, MinusIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

export type FormType = "UP" | "DOWN" | "NEUTRAL";

type Props = {
    form: FormType,
    className?: string,
    size?: number
}

export default function FormIndicator({ form, className, size = 15 }: Props) {

    return (
        <>
            {form === "UP" && <FlameIcon size={size} className={twMerge('text-green-500 hidden', className)} />}
            {form === "DOWN" && <ArrowDownRightIcon size={size} className={twMerge('text-red-500', className)} />}
            {form === "NEUTRAL" && <MinusIcon size={size} className={twMerge('text-slate-500', className)} />}
        </>
    )
}

type AvailablityProps = {
    availability: boolean,
    className?: string
}


export function AvailabilityIndicator({ availability, className }: AvailablityProps) {

    return (
        <>
            {availability === true && <Check size={15} className={twMerge('text-slate-500', className)} />}
            {availability === false && <Info size={15} className={twMerge('text-orange-500', className)} />}
        </>
    )
}