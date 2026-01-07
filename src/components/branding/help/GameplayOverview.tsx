import { ChevronRight } from "lucide-react";
import { gameplayModalData } from "../../../data/gameplayModalData";
import { GameplayTopic } from "../../../types/gameplayModal";
import SecondaryText from "../../ui/typography/SecondaryText";
import PrimaryButton, { TranslucentButton } from "../../ui/buttons/PrimaryButton";
import ScrummyLogo from "../scrummy_logo";
import RoundedCard from "../../ui/cards/RoundedCard";

type Props = {
    onTopicSelect: (topic: GameplayTopic, index: number) => void;
    onClose?: () => void
}

export default function GameplayOverview({ onTopicSelect, onClose }: Props) {
    return (
        <div className="flex flex-col items-center justify-center w-full  gap-4">
            {/* Header */}

            <div className="text-center flex flex-col justify-center items-center gap-1">

                <ScrummyLogo className="w-28 h-28" />

                {/* <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {gameplayModalData.title}
                </h1> */}
                <h2 className="text-lg text-primary-600 dark:text-primary-400">
                    {gameplayModalData.subTitle}
                </h2>
                {gameplayModalData.description && (
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {gameplayModalData.description}
                    </p>
                )}
            </div>

            {/* Topics */}
            <div className="space-y-3">
                {gameplayModalData.subTopics.map((topic, index) => (
                    <RoundedCard
                        key={index}
                        onClick={() => onTopicSelect(topic, index)}
                        className="p-3 cursor-pointer flex flex-row items-center justify-between gap-2"
                    >
                        <div className="flex items-center flex-1">

                            <TranslucentButton className="w-fit flex flex-col items-center justify-center" >
                                <span className="text-xl">{topic.emoji}</span>
                            </TranslucentButton>

                        </div>

                        <div className="flex flex-col">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {topic.title}
                            </h3>
                            <SecondaryText className="text-xs">
                                {topic.description}
                            </SecondaryText>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-500 ml-2 flex-shrink-0" />
                    </RoundedCard>
                ))}
            </div>

            <PrimaryButton onClick={onClose} className="py-3" >Continue</PrimaryButton>
        </div>
    );
}
