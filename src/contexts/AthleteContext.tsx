import { createContext, useContext, ReactNode, useMemo } from "react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { athleteService } from "../services/athleteService";
import useSWR from "swr";
import { extractUniqueAthletePositions, extractUniqueAthleteTeams } from "../utils/athleteUtils";


interface AthleteContextType {
  athletes: RugbyPlayer[];
  isLoading: boolean;
  error: string | null;
  refreshAthletes: () => Promise<void>;
  getAthleteById: (id: string) => RugbyPlayer | undefined;
  positions: string[];
  teams: string[];
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

type ProviderProps = {
  children?: ReactNode
}

export function AthleteProvider({ children}: ProviderProps) {

  const fetchKey = `supported-athletes`;
  const {data: athletesFetch, isLoading, error} = useSWR(fetchKey, () => athletesFetcher());
  const athletes = athletesFetch ?? [];

  const positions = useMemo(() => {
    return extractUniqueAthletePositions(athletes);
  }, [athletes]); 

  const teams = useMemo(() => {
    return extractUniqueAthleteTeams(athletes);
  }, [athletes]);

  const refreshAthletes = async () => {};

  const getAthleteById = (id: string) => {
    return athletes.find(
      (athlete) => athlete.id === id || athlete.tracking_id === id
    );
  };

  return (
    <AthleteContext.Provider
      value={{
        athletes,
        isLoading,
        error,
        refreshAthletes,
        getAthleteById,
        positions,
        teams,
      }}
    >
      {children}
    </AthleteContext.Provider>
  );
};

export const useAthletes = (includeMock?: boolean) => {
  const context = useContext(AthleteContext);
  if (context === undefined) {
    throw new Error("useAthletes must be used within an AthleteProvider");
  }

  let athletes = context.athletes;

  if (includeMock && athletes.length === 0) {
    athletes = athleteService.getMockRugbyPlayers();
  }

  return {...context, athletes};
};


async function athletesFetcher() {
  const athletes = await athleteService.getSupportedPlayers();

  return athletes.sort((a, b) => {
    return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0)
  })
}