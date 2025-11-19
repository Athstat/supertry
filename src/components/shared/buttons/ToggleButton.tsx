import { twMerge } from "tailwind-merge";

type Props = {
    value?: boolean,
    onChange?: (newVal: boolean) => void
}

/** Renders Toogle Button */
export default function ToggleButton({ value, onChange }: Props) {

    const handleOnClick = () => {
        if (onChange) {
            onChange(!value);
        }
    }

    return (
        <button
            onClick={handleOnClick}
            className="border-[3px] w-[60px] h-[30px] dark:border-slate-300 rounded-xl overflow-clip"
        >
            {/* Handle */}
            <div
                className={twMerge(
                    'w-[30px] bg-blue-500 h-[30px] rounded-xl'
                )}
            >

            </div>
        </button>
    )
}
