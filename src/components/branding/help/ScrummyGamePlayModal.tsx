import { useState } from "react";
import DialogModal from "../../shared/DialogModal";
import GameplayOverview from "./GameplayOverview";
import TopicDetail from "./TopicDetail";
import { GameplayTopic } from "../../../types/gameplayModal";

type Props = {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function ScrummyGamePlayModal({ isOpen, onClose }: Props) {

    const [selectedTopic, setSelectedTopic] = useState<GameplayTopic | null>(null);

    const handleTopicSelect = (topic: GameplayTopic) => {
        setSelectedTopic(topic);
    };

    const handleBackToOverview = () => {
        setSelectedTopic(null);
    };

    return (
        <DialogModal
            open={isOpen}
            onClose={onClose}
            title={selectedTopic ? selectedTopic.title : "How to Play Scrummy"}
            hw="w-[95%] md:w-[85%] lg:w-[70%] lg:max-w-[65vh] lg:min-w-[65vh]"
            outerCon="no-scrollbar"
            className="w-full h-full mb-10"
        >
            {selectedTopic ? (
                <TopicDetail 
                    topic={selectedTopic} 
                    onBack={handleBackToOverview} 
                />
            ) : (
                <GameplayOverview 
                    onTopicSelect={handleTopicSelect} 
                    onClose={onClose}
                />
            )}
        </DialogModal>
    );
}
