import { createContext, ReactNode, useEffect } from "react";
import { IFantasyLeague } from "../types/fantasyLeague";
import { RankedFantasyTeam } from "../types/league";
import { useAtomValue, useSetAtom } from "jotai";
import { fantasyLeagueAtom } from "../state/fantasyLeague.atoms";

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

  const setFantasyLeague = useSetAtom(fantasyLeagueAtom);

  useEffect(() => {
    if (league) setFantasyLeague(league);
  }, [league]);


  return (
    <FantasyLeagueContext.Provider value={{ league, userTeam }} >
        {children}
    </FantasyLeagueContext.Provider>
  )
}
