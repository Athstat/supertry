import { ChevronRight } from "lucide-react";
import { gameplayModalData } from "../../../data/gameplayModalData";
import { GameplayTopic } from "../../../types/gameplayModal";
import SecondaryText from "../../ui/typography/SecondaryText";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import ScrummyLogo from "../scrummy_logo";
import RoundedCard from "../../ui/cards/RoundedCard";
import { useNavigate } from "react-router-dom";

type Props = {
    onTopicSelect: (topic: GameplayTopic, index: number) => void;
    onClose?: () => void
}

export default function GameplayOverview({ onTopicSelect, onClose }: Props) {

    const navigate = useNavigate();
    const handleOnboarding = () => {
        navigate('/post-signup-welcome');
    }

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
                        className="p-3 cursor-pointer flex flex-col items-start gap-2"
                    >
                        <div className="flex flex-row items-center justify-between w-full gap-2">

                            <div className="flex flex-row items-center gap-2" >
                                <p className="text-xl">{topic.emoji}</p>

                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                    {topic.title}
                                </h3>
                            </div>

                            <div>
                                <ChevronRight className="w-5 h-5 text-gray-500 ml-2 flex-shrink-0" />
                            </div>
                        </div>

                        <div className="flex flex-col">

                            <SecondaryText className="text-xs">
                                {topic.description}
                            </SecondaryText>
                        </div>


                    </RoundedCard>
                ))}

                <RoundedCard onClick={handleOnboarding} className="p-4 cursor-pointer" >
                    <p className="font-semibold" >Go Through Onboarding</p>
                    <SecondaryText className="text-xs" >Setup your SCRUMMY account, go through the basics of how SCRUMMY works!</SecondaryText>
                </RoundedCard>
            </div>

            <PrimaryButton onClick={onClose} className="py-3" >Continue</PrimaryButton>
        </div>
    );
}
