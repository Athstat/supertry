import { twMerge } from "tailwind-merge";
import Dropdown from "../../components/ui/forms/Dropdown";
import { DropdownOption } from "../../types/ui"

type Props = {
    seasons: string[],
    value?: string,
    onChange?: (season: string) => void,
    className?: string
}

export default function SbrSeasonFilter({ seasons, value, onChange, className }: Props) {

    const options: DropdownOption[] = [
        { label: "All", value: 'all' },
        ...(seasons.map((s) => {
            return {
                label: s,
                value: s
            }
        }))
    ];

    const handleChange = (s: string | undefined) => {
        if (s && onChange) {
            onChange(s);
        }
    }

    return (
        <div className={twMerge(
            "relative w-[100%] z-50",
            className
        )} >
            <Dropdown
                options={options}
                value={value}
                onChange={handleChange}
                className="w-full"
                selectedClassName="h-[45px]"
            />
        </div>
    )
}
