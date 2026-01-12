 
import { createContext, ReactNode } from "react";
import { IProAthlete } from "../types/athletes";

type ContextProps = {
    isComparing?: boolean,
    selectedPlayers: IProAthlete[]
}

export const PlayersScreenContext = createContext<ContextProps | null>(null);

type Props = {
    isComparing?: boolean,
    selectedPlayers: IProAthlete[],
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
