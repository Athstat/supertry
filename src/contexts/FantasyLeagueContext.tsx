import { createContext, ReactNode, useEffect } from "react";
import { IFantasyLeague } from "../types/fantasyLeague";
import { RankedFantasyTeam } from "../types/league";
import { useSetAtom } from "jotai";
import { fantasyLeagueAtom, userFantasyTeamAtom } from "../state/fantasyLeague.atoms";
import useSWR from "swr";
import { LoadingState } from "../components/ui/LoadingState";
import { leagueService } from "../services/leagueService";
import { authService } from "../services/authService";

type ContextProps = {
  league?: IFantasyLeague,
  userTeam?: RankedFantasyTeam
}

export const FantasyLeagueContext = createContext<ContextProps | undefined>(undefined);

type Props = {
    league?: IFantasyLeague,
    children?: ReactNode,
    userTeam?: RankedFantasyTeam,
}

export default function FantasyLeagueProvider({league, children, userTeam}: Props) {

  const setFantasyLeague = useSetAtom(fantasyLeagueAtom);
  const setUserFantasyTeam = useSetAtom(userFantasyTeamAtom);
  const user = authService.getUserInfo();

  const {data: participatingTeams, isLoading} = useSWR(`user-teams/${league?.id}`, () => leagueService.fetchParticipatingTeams(league?.id ?? "0"));

  useEffect(() => {
    if (league) setFantasyLeague(league);

    if (participatingTeams && user) {
      const userRoundTeam = participatingTeams.find((t) => {
        return t.user_id === user.id;
      });

      if (userRoundTeam) setUserFantasyTeam(userRoundTeam);
    }

  }, [league, user, participatingTeams]);

  if (isLoading) {
    return <LoadingState />
  }

  return (
    <FantasyLeagueContext.Provider value={{ league, userTeam }} >
        {children}
    </FantasyLeagueContext.Provider>
  )
}
