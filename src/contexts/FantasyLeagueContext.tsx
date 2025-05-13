import { createContext, ReactNode } from "react";
import { IFantasyLeague } from "../types/fantasyLeague";
import { RankedFantasyTeam } from "../types/league";

type ContextProps = {
  league?: IFantasyLeague,
  userTeam?: RankedFantasyTeam
}

export const FantasyLeagueContext = createContext<ContextProps | undefined>(undefined);

type Props = {
    league?: IFantasyLeague,
    children?: ReactNode,
    userTeam?: RankedFantasyTeam
}

export default function FantasyLeagueProvider({league, children, userTeam}: Props) {


  return (
    <FantasyLeagueContext.Provider value={{ league, userTeam }} >
        {children}
    </FantasyLeagueContext.Provider>
  )
}
