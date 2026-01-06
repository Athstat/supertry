import { ArrowLeft } from "lucide-react";
import { GameplayTopic } from "../../../types/gameplayModal";
import SecondaryText from "../../ui/typography/SecondaryText";
import FantasyPointsBreakdown from "./FantasyPointsBreakdown";

type Props = {
    topic: GameplayTopic;
    onBack: () => void;
}

export default function TopicDetail({ topic, onBack }: Props) {
    return (
        <div className="space-y-6">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center text-primary-600 dark:text-primary-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Back to Overview</span>
            </button>

            {/* Topic Header */}
            <div className="text-center space-y-3">
                <div className="text-4xl">{topic.emoji}</div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {topic.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {topic.description}
                </p>
            </div>

            {/* Conditional Rendering: Fantasy Points Breakdown or Generic Sub-topics */}
            {topic.title === "Fantasy Points Breakdown" ? (
                <FantasyPointsBreakdown />
            ) : (
                <div className="space-y-8">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">

                    </h2>

                    <div className="space-y-8">
                        {topic.subTopics.map((subTopic, index) => (
                            <div
                                key={index}
                                className="flex flex-col"
                            >
                                <h3 className="font-bold text-gray-900 dark:text-gray-100">
                                    {subTopic.title}
                                </h3>
                                <SecondaryText className="leading-relaxed">
                                    {subTopic.description}
                                </SecondaryText>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
