import { Plus, X } from "lucide-react";
import { useTopicReactions } from "../../../hooks/ui/useTopicReactions";
import { EMOJI_REACTION_OPTIONS } from "../../../types/constants";
import CircleButton from "../buttons/BackButton";
import RoundedCard from "../cards/RoundedCard";
import EmojiReactionButton from "./EmojiReactionButton";
import BottomSheetView from "../modals/BottomSheetView";
import { useState } from "react";

export default function EmojiReactionPicker() {

    const { updateReaction } = useTopicReactions();

    const [showModal, setShowModal] = useState(false);
    const toggle = () => setShowModal(prev => !prev);

    const handleClick = (emoji: string) => {
        updateReaction(emoji);
    }

    const first4Reactions = [...EMOJI_REACTION_OPTIONS].slice(0, 10);

    return (
        <div className="max-w-full overflow-x-clip flex flex-col gap-2" >
            <p className="font-semibold">Game Reactions</p>

            <RoundedCard className="flex flex-row max-w-full overflow-x-hidden no-scrollbar items-center gap-3 bg-slate-50 dark:hover:bg-slate-800 rounded-full no-scrollbar px-2 py-2 w-fit border border-slate-100 flex-nowrap" >

                <div className="flex flex-row relative max-w-full overflow-x-scroll no-scrollbar items-center gap-3 rounded-full no-scrollbar px-2 py-2 w-fit flex-nowrap" >
                    {first4Reactions.map((emoji) => {
                        return (
                            <EmojiReactionButton
                                emoji={emoji}
                                onClick={handleClick}
                            />
                        )
                    })}

                </div>

                <CircleButton onClick={toggle} className=" min-w-10 min-h-10 bg-slate-300 dark:bg-slate-700" >
                    <Plus />
                </CircleButton>
            </RoundedCard>

            <EmojiBottomSheetPicker
                emojies={EMOJI_REACTION_OPTIONS}
                isOpen={showModal}
                onClick={handleClick}
                onClose={toggle}
            />
        </div>
    )
}

type EmojiBottomSheetPickerProps = {
    onClick?: (emoji: string) => void,
    emojies: string[],
    onClose?: () => void,
    isOpen?: boolean
}

export function EmojiBottomSheetPicker({ onClick, onClose, emojies, isOpen }: EmojiBottomSheetPickerProps) {

    if (!isOpen) {
        return null;
    }

    return (
        <BottomSheetView
            hideHandle
            className="p-4 max-h-[90vh] flex flex-col items-center justify-center gap-6 pb-10"
            onClickOutside={onClose}
        >
            <div className="flex w-full flex-row items-center justify-between" >
                <div>
                    <p className="font-bold text-lg" >Add your reaction!</p>
                </div>

                <CircleButton onClick={onClose} >
                    <X />
                </CircleButton>
            </div>

            <div className="flex flex-row items-center gap-4 w-full flex-wrap" >
                {emojies.map((emoji) => {
                    return (
                        <EmojiReactionButton
                            emoji={emoji}
                            onClick={onClick}
                            className="bg-slate-100 dark:bg-slate-700"
                        />
                    )
                })}
            </div>

        </BottomSheetView>
    )
}