import React, { createContext, useContext } from "react";
import useSWR from "swr";
import { swrFetchKeys } from "../utils/swrKeys";
import { djangoAthleteService } from "../services/athletes/djangoAthletesService";
import { IProTeam } from "../types/team";
import { IProAthlete } from "../types/athletes";

interface AthleteContextType {
  athletes: IProAthlete[];
  isLoading: boolean;
  error: string | null;
  refreshAthletes: () => Promise<void>;
  getAthleteById: (id: string) => IProAthlete | undefined;
  positions: string[];
  teams: IProTeam[];
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

export const AthleteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const key = swrFetchKeys.getAllProAthletesKey();
  const {data: fetchedAthletes, isLoading: loadingAthletes, mutate, error} = useSWR(key, () => djangoAthleteService.getAllAthletes());

  const athletes = fetchedAthletes ?? [];
  const isLoading = loadingAthletes;

  const teams: IProTeam[] = []
  const positions: string[] = [];
  
  athletes.forEach((a) => {
    if (!teams.some(t => t.athstat_id === a.team.athstat_id)) {
      teams.push(a.team);
    }

    if (a.position && !positions.includes(a.position)) {
      positions.push(a.position);
    }

  });

  const refreshAthletes = async () => {
    await mutate(() => djangoAthleteService.getAllAthletes());
  }

  const getAthleteById = (id: string) => {
    return athletes.find(
      (athlete) => athlete.tracking_id === id || athlete.tracking_id === id
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

export const useAthletes = () => {
  const context = useContext(AthleteContext);
  if (context === undefined) {
    throw new Error("useAthletes must be used within an AthleteProvider");
  }
  return context;
};
