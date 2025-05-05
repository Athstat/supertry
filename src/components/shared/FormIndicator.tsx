import { ArrowDownRightIcon, FlameIcon, MinusIcon } from "lucide-react"
import { twMerge } from "tailwind-merge"

export type FormType = "UP" | "DOWN" | "NEUTRAL";

type Props = {
    form: FormType,
    className?: string
}

export default function FormIndicator({ form, className }: Props) {

    return (
        <>
            {form === "UP" && <FlameIcon size={15} className={twMerge('text-green-500', className)} />}
            {form === "DOWN" && <ArrowDownRightIcon size={15} className={twMerge('text-red-500', className)} />}
            {form === "NEUTRAL" && <MinusIcon size={15} className={twMerge('text-slate-500', className)} />}
        </>
    )
}
