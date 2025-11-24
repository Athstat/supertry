import { createContext, ReactNode, useEffect } from "react";
import { IFantasyLeagueRound } from "../types/fantasyLeague";
import { RankedFantasyTeam } from "../types/league";
import { useSetAtom } from "jotai";
import useSWR from "swr";
import { LoadingState } from "../components/ui/LoadingState";
import { leagueService } from "../services/leagueService";
import { authService } from "../services/authService";
import { fantasyLeagueAtom, userFantasyTeamAtom } from "../state/fantasy/fantasyLeague.atoms";

type ContextProps = {
  league?: IFantasyLeagueRound,
  userTeam?: RankedFantasyTeam
}

export const FantasyLeagueContext = createContext<ContextProps | undefined>(undefined);

type Props = {
    league?: IFantasyLeagueRound,
    children?: ReactNode,
    userTeam?: RankedFantasyTeam,
}

export default function FantasyLeagueProvider({league, children, userTeam}: Props) {

  const setFantasyLeague = useSetAtom(fantasyLeagueAtom);
  const setUserFantasyTeam = useSetAtom(userFantasyTeamAtom);
  const user = authService.getUserInfoSync();

  const {data: participatingTeams, isLoading} = useSWR(`user-teams/${league?.id}`, () => leagueService.fetchParticipatingTeams(league?.id ?? "0"));

  useEffect(() => {
    if (league) setFantasyLeague(league);

    if (participatingTeams && user) {
      const uid = (user as any)?.kc_id ?? (user as any)?.id;
      const userRoundTeam = participatingTeams.find((t) => {
        return t.user_id === uid;
      });

      if (userRoundTeam) setUserFantasyTeam(userRoundTeam);
    }

  }, [league, user, participatingTeams, setFantasyLeague, setUserFantasyTeam]);

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <FantasyLeagueContext.Provider value={{ league, userTeam }} >
        {children}
    </FantasyLeagueContext.Provider>
  )
}
