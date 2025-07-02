import { twMerge } from "tailwind-merge"

type Props = {
    label?: string,
    value?: string | number,
    className?: string
}

/** Renders a transparent statistics card */
export default function TransparentStatCard({ label, value, className }: Props) {
    return (
        <div className={twMerge(
            "bg-white/10 rounded-lg p-4 w-full",
            className
        )}>
            <div className="text-sm text-primary-100">{label}</div>
            <div className="text-xl font-bold">
                {value}
            </div>
        </div>
    )
}
