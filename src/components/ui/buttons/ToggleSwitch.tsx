import { twMerge } from "tailwind-merge"
import RoundedCard from "../../shared/RoundedCard"

type Props = {
    className?: string,
    option1: string,
    option2: string,
    onChange?: (val: string) => void,
    value?: string
}

export default function ToggleSwitch({ option1, option2, onChange, value = option1, className }: Props) {
    // For animation, we use a sliding background under the selected option
    const selectedIdx = value === option1 ? 0 : 1;

    return (
        <RoundedCard
            className={twMerge(
                "relative flex rounded-xl dark:bg-slate-800/80 min-w-[120px] flex-row items-center cursor-pointer bg-gray-200 overflow-hidden",
                className
            )}
        >
            {/* Animated background */}
            <div
                className="absolute top-0 bottom-0 left-0 w-1/2 rounded-xl transition-transform duration-300 ease-in-out z-0"
                style={{
                    transform: `translateX(${selectedIdx * 100}%)`,
                    background: '#3b82f6',
                    borderRadius: '',
                }}
            />
            <div className="flex flex-row w-full z-10 relative">
                <ToggleSwitchItem
                    option={option1}
                    onClick={onChange}
                    isCurrent={option1 === value}
                />
                <ToggleSwitchItem
                    option={option2}
                    onClick={onChange}
                    isCurrent={option2 === value}
                />
            </div>
        </RoundedCard>
    );
}


type SwitchItemProps = {
    option: string,
    isCurrent: boolean,
    onClick?: (val: string) => void
}

function ToggleSwitchItem({ option, isCurrent, onClick }: SwitchItemProps) {
    const handleClick = () => {
        if (onClick) {
            onClick(option);
        }
    };
    return (
        <div
            onClick={handleClick}
            className={twMerge(
                "flex-1 text-center px-3 py-1 select-none transition-colors duration-300 cursor-pointer",
                isCurrent ? "text-white font-semibold" : ""
            )}
            style={{ position: 'relative', zIndex: 2 }}
        >
            {option}
        </div>
    );
}