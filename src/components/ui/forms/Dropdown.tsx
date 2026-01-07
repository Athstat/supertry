import { Activity, useEffect, useMemo, useRef, useState } from "react"
import { twMerge } from "tailwind-merge"
import { ChevronDown } from "lucide-react"
import { useInView } from "react-intersection-observer"
import { useClickOutside } from "../../../hooks/web/useClickOutside"
import { DropdownOption } from "../../../types/ui"
import RoundedCard from "../cards/RoundedCard"

type Props = {
    onChange?: (value?: string) => void,
    value?: string,
    options: DropdownOption[],
    showSearch?: boolean,
    className?: string,
    selectedClassName?: string
}

/** Renders a drop down component */
export default function Dropdown({ onChange, value, options, className, selectedClassName }: Props) {

    const ref = useRef<HTMLDivElement>(null);


    const [showOptions, setShowOptions] = useState<boolean>(false);
    const toggle = () => {
        setShowOptions(prev => !prev);
    }

    useClickOutside(ref, () => setShowOptions(false));

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
        <div
            className={twMerge(
                "w-[130px]",
                className
            )}

            ref={ref}
        >
            {selectedOption && <SelectedIndicator
                option={selectedOption}
                isOpen={showOptions}
                onClick={toggle}
                className={selectedClassName}
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
    onClick?: () => void,
    className?: string
}

/** Renders a card with the selected item */
function SelectedIndicator({ option, isOpen, onClick, className }: SelectedProps) {
    return (
        <RoundedCard
            className={twMerge(
                "dark:bg-slate-700/60 cursor-pointer px-2 text-sm dark:border-slate-600 flex flex-row items-center justify-between relative w-full h-[35px] rounded-md",
                className
            )}
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
                    "dark:bg-black bg-white"
                )
            }
        >
            <div className={twMerge(
                "w-full flex flex-col rounded-md dark:bg-slate-700/70 bg-white px-0.5 py-1",
            )} >
                {options.map((o) => {

                    return (
                        <OptionItem
                            key={o.value}
                            onClick={onClickOption}
                            currentValue={value}
                            option={o}
                        />
                    )
                })}
            </div>
        </div>
    )
}

type OptionItemProps = {
    option: DropdownOption,
    currentValue?: string,
    onClick?: (value: string) => void
}

function OptionItem({ option, onClick, currentValue }: OptionItemProps) {

    const { value, label } = option;
    const isCurrent = currentValue === value;

    const divRef = useRef<HTMLDivElement>(null);
    const { ref: inViewRef, inView } = useInView({ triggerOnce: true });

    const setRefs = (el: HTMLDivElement | null) => {
        divRef.current = el;
        inViewRef(el);
    }

    useEffect(() => {
        if (divRef && isCurrent && !inView) {
            divRef.current?.scrollIntoView({
                behavior: "auto",
                block: "nearest"
            })
        }
    }, [inView, isCurrent]);

    const handleOnClick = () => {
        if (value && onClick) {
            onClick(value)
        }
    }

    return (
        <div
            ref={setRefs}
            key={option.value}
            onClick={handleOnClick}
            className={twMerge(
                "cursor-pointer  hover:dark:bg-slate-600 hover:bg-blue-500/20 dark:text-slate-200 px-2 py-1 rounded-md",
                isCurrent && "dark:bg-blue-500/30 bg-blue-500/20 text-blue-600 dark:text-blue-200"
            )}
        >
            <p className=" cursor-pointer" >{label}</p>
        </div>
    )
}