import { useAtom } from "jotai";
import { gameStoryAtoms } from "../../state/dashboard/gameStory.atoms";
import { useCallback } from "react";

export function useGameStory() {

    const [isPaused, setIsPaused] = useAtom(gameStoryAtoms.isPausedAtom);
    const [currentSlideIndex, setCurrentSlideIndex] = useAtom(gameStoryAtoms.currentSlideIndexAtom);
    const [progress, setProgress] = useAtom(gameStoryAtoms.progressAtom);
    const [currentGame, setCurrentGame] = useAtom(gameStoryAtoms.currentGameAtom);

    const pauseStory = useCallback(() => {
        setIsPaused(true);
    }, [setIsPaused])

    const resumeStory = useCallback(() => {
        setIsPaused(false);
    }, [setIsPaused]);

    const togglePause = useCallback(() => {
        setIsPaused(prev => !prev);
    }, [setIsPaused]);


    return {
        isPaused,
        pauseStory,
        resumeStory,
        togglePause,
        progress,
        setProgress,
        currentSlideIndex,
        setCurrentSlideIndex,
        setIsPaused,
        currentGame,
        setCurrentGame
    }
}
