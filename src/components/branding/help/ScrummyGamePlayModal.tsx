import { useState, useEffect, useRef } from "react";
import GameplayOverview from "./GameplayOverview";
import TopicDetail from "./TopicDetail";
import { GameplayTopic } from "../../../types/gameplayModal";
import DialogModal from "../../ui/modals/DialogModal";

type Props = {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function ScrummyGamePlayModal({ isOpen, onClose }: Props) {

    const [selectedTopic, setSelectedTopic] = useState<GameplayTopic | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleTopicSelect = (topic: GameplayTopic) => {
        setSelectedTopic(topic);
    };

    const handleBackToOverview = () => {
        setSelectedTopic(null);
    };

    // Scroll to top when topic changes
    useEffect(() => {
        if (modalRef.current) {
            const scrollableContainer = modalRef.current.closest('.overflow-y-auto');
            if (scrollableContainer) {
                scrollableContainer.scrollTop = 0;
            }
        }
    }, [selectedTopic]);

    return (
        <DialogModal
            ref={modalRef}
            open={isOpen}
            onClose={onClose}
            title={selectedTopic ? selectedTopic.title : "How to Play Scrummy"}
            hw="w-[96%] md:w-[85%] lg:w-[70%] lg:max-w-[65vh] lg:min-w-[65vh]"
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
