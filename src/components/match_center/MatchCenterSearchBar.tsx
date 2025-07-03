import { Search } from "lucide-react"
import RoundedCard from "../shared/RoundedCard"

type Props = {
    value?: string,
    onChange?: (val: string) => void,
    placeholder?: string
}

export default function MatchCenterSearchBar({ value, onChange, placeholder }: Props) {

    const handleChange = (val?: string) => {
        if (onChange) {
            onChange(val ?? "");
        }
    }

    return (
        <RoundedCard className="px-4 py-3 flex flex-row items-center gap-1" >
            <Search className="dark:text-dark-500 text-slate-700" />
            <input 
                className="bg-transparent outline-none w-full"
                placeholder={placeholder ?? "Search games, season ..."}
                onChange={(e) => handleChange(e.target.value)}
                value={value}
            />
        </RoundedCard>
    )
}
