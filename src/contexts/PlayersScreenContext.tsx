import { createContext, ReactNode } from "react";
import { RugbyPlayer } from "../types/rugbyPlayer";

type ContextProps = {
    isComparing?: boolean,
    selectedPlayers: RugbyPlayer[]
}

export const PlayersScreenContext = createContext<ContextProps | null>(null);

type Props = {
    isComparing?: boolean,
    selectedPlayers: RugbyPlayer[],
    children?: ReactNode
}

/** Context provider for players list screen */
export default function PlayersScreenProvider({isComparing, selectedPlayers, children} : Props) {
    return (
        <PlayersScreenContext.Provider value={{isComparing, selectedPlayers}}>
            {children}
        </PlayersScreenContext.Provider>
    )
}
