import { ScopeProvider } from "jotai-scope";
import { gameStoryAtoms } from "../../../state/dashboard/gameStory.atoms";
import { ReactNode } from "react";

type Props = {
    children?: ReactNode
}

/** Provides state to a game story component */
export default function GameStoryProvider({children}: Props) {

    const atoms = [
        gameStoryAtoms.isPausedAtom,
        gameStoryAtoms.progressAtom,
        gameStoryAtoms.currentGameAtom,
        gameStoryAtoms.currentSlideIndexAtom
    ];

    return (
        <ScopeProvider
            atoms={ atoms }
        >
            {children}
        </ScopeProvider>
    )
}

