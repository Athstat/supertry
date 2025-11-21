import { Activity, useMemo, useState } from "react"
import { DropdownOption } from "../../types/ui"
import RoundedCard from "./RoundedCard"
import { twMerge } from "tailwind-merge"
import { ChevronDown } from "lucide-react"

type Props = {
    onChange?: (value?: string) => void,
    value?: string,
    options: DropdownOption[],
    showSearch?: boolean,
    className?: string
}

/** Renders a drop down component */
export default function Dropdown({ onChange, value, options, className }: Props) {

    const [showOptions, setShowOptions] = useState<boolean>(true);
    const toggle = () => {
        setShowOptions(prev => !prev);
    }

    const selectedOption = useMemo(() => {
        const foundOption = options.find(o => o.value === value);

        if (foundOption) {
            return foundOption;
        }

        if (options.length > 0) {
            return options[0];
        }

        return undefined;
    }, [options, value]);

    return (
        <div className={twMerge(
            "w-[130px]",
            className
        )} >
            {selectedOption && <SelectedIndicator
                option={selectedOption}
                isOpen={showOptions}
                onClick={toggle}
            />}

            <Activity mode={showOptions ? "visible" : "hidden"} >
                <OptionsTray
                    options={options}
                    value={value}
                    onClickOption={onChange}
                    className={className}
                />
            </Activity>
        </div>
    )
}

type SelectedProps = {
    option: DropdownOption,
    isOpen?: boolean,
    onClick?: () => void
}

/** Renders a card with the selected item */
function SelectedIndicator({ option, isOpen, onClick }: SelectedProps) {
    return (
        <RoundedCard
            className="dark:bg-slate-700/60 cursor-pointer px-2 text-sm dark:border-slate-600 flex flex-row items-center justify-between relative w-full h-[35px] rounded-md"
            onClick={onClick}
        >
            <p>{option.label}</p>

            <div className="" >
                <ChevronDown className={twMerge(
                    "w-4 h-4 transition-all ease-in delay-150",
                    isOpen && "rotate-180"
                )} />

                {/* {isOpen && (
                    <ChevronUp className="w-4 h-4" />
                )} */}
            </div>
        </RoundedCard>
    )
}

type OptionsTrayProps = {
    options: DropdownOption[],
    value?: string,
    onClickOption?: (value: string) => void,
    className?: string
}

function OptionsTray({ options, value, onClickOption, className }: OptionsTrayProps) {

    return (
        <div 
            className={
                twMerge(
                    "w-[130px] mt-2 absolute z-[40] rounded-md max-h-[300px] border dark:border-slate-600 overflow-y-auto",
                    className,
                    "dark:bg-black"
                )
            }
        >
            <div className={twMerge(
                "w-full flex flex-col rounded-md dark:bg-slate-700/70 px-0.5 py-1",
            )} >
                {options.map((o) => {

                    const handleOnClick = () => {
                        if (o.value && onClickOption) {
                            onClickOption(o.value)
                        }
                    }

                    return (
                        <div
                            key={o.value}
                            onClick={handleOnClick}
                            className={twMerge(
                                "cursor-pointer hover:bg-slate-600 dark:text-slate-200 px-2 py-1 rounded-md",
                                value === o.value && "dark:bg-blue-500/30 dark:text-blue-200"
                            )}
                        >
                            <p className=" cursor-pointer" >{o.label}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}