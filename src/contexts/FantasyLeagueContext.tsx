import { createContext, ReactNode } from "react";
import { IFantasyLeague } from "../types/fantasyLeague";

export const FantasyLeagueContext = createContext<IFantasyLeague | undefined>(undefined);

type Props = {
    league?: IFantasyLeague,
    children?: ReactNode
}

export default function FantasyLeagueProvider({league, children}: Props) {


  return (
    <FantasyLeagueContext.Provider value={league} >
        {children}
    </FantasyLeagueContext.Provider>
  )
}
