import { twMerge } from "tailwind-merge";

type Props = {
    value?: boolean,
    onChange?: (newVal: boolean) => void,
    isDisable?: boolean
}

/** Renders Toggle Button */
export default function ToggleButton({ value, onChange, isDisable }: Props) {

    const handleOnClick = () => {
        if (onChange && !isDisable) {
            onChange(!value);
        }
    }

    const finalValue = value && !isDisable;

    return (
        <button
            onClick={handleOnClick}
            className={twMerge(
                "w-[60px] h-[30px] rounded-full transition-colors duration-300 border border-slate-100 dark:border-slate-500 flex flex-row items-center",
                finalValue ? "bg-blue-500 dark:border-blue-400 " : "bg-gray-300 dark:bg-slate-600"
            )}
        >
            {/* Handle */}
            <div
                className={twMerge(
                    'w-[30px] h-[23px] bg-white  rounded-full transition-transform duration-300',
                    finalValue ? "translate-x-[25px]" : "translate-x-[3px]"
                )}
            />
        </button>
    )
}