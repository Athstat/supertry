import { createContext, ReactNode, useContext } from "react"
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";

type MyTeamScreenContextProps = {
    onUpdateTeam: (team: IFantasyLeagueTeam) => void,
}

export const MyTeamScreenContext = createContext<MyTeamScreenContextProps | null>(null);

type Props = {
    onUpdateTeam: (team: IFantasyLeagueTeam) => void,
    children?: ReactNode
}

export default function MyTeamScreenProvider({onUpdateTeam, children}: Props) {

  return (
    <MyTeamScreenContext.Provider
        value={{onUpdateTeam}}
    >
        {children}
    </MyTeamScreenContext.Provider>
  )
}


export function useMyTeamScreen() {
    const context = useContext(MyTeamScreenContext);

    if (context === null) {
        throw new Error("useMyTeamScreen() was used outside the MyTeamScreenProvider");
    }

    return context;
}