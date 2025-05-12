import { Search } from "lucide-react"
import { twMerge } from "tailwind-merge"

type Props = {
    value?: string,
    onChange?: (value: string) => void,
    placeholder?: string,
    className?: string
}

export default function AthletesSearchBar({ value, onChange, className, placeholder }: Props) {

    const handleChange = (input: string) => {
        if (onChange) {
            onChange(input);
        }
    }

    return (
        <div className={
            twMerge(
                "w-full h-14 bg-white border dark:text-slate-400 text-slate-700 border-slate-100 dark:border-slate-800/40 dark:bg-slate-800/40 rounded-xl p-3 flex flex-row items-center gap-2",
                className
            )
        } >
            <Search className="" />
            <input
                className="bg-transparent w-full outline-none h-full"
                placeholder={placeholder ?? "Search athletes..."}
                value={value}
                onChange={(e) => handleChange(e.target.value)}
            />
        </div>
    )
}
