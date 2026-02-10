import { twMerge } from "tailwind-merge";
import { compactNumber } from "../../../utils/intUtils";
import SecondaryText from "../typography/SecondaryText";

type EmojiReactionButtonProps = {
    emoji: string,
    onClick?: (emoji: string) => void,
    count?: number,
    className?: string,
    showBorder?: boolean
}

export default function EmojiReactionButton({ emoji, onClick, className, count, showBorder }: EmojiReactionButtonProps) {

    const handleClick = () => {
        if (onClick) {
            onClick(emoji);
        }
    }

    const showCount = count !== undefined && count > 0;

    return (
        <button
            className={twMerge(
                "text-[24px] w-[40px] flex flex-row items-center justify-center gap-1 h-[40px] rounded-xl active:bg-slate-800 transition-all delay-0 hover:-rotate-12",
                showBorder && "border-[1px] hover:rotate-0 dark:border-slate-600 hover:bg-slate-500 hover:dark:bg-slate-700/60 px-3 py-1 w-fit h-fit text-[16px] rounded-2xl",
                className
            )}
            onClick={handleClick}
        >
            <p>{emoji}</p>
            {showCount && <SecondaryText className="text-sm" >{compactNumber(count)}</SecondaryText>}
        </button>
    )
}