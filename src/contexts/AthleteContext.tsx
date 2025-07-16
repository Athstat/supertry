import React, { createContext, useContext, useMemo } from "react";
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

  // Memoize teams extraction for better performance
  const teams = useMemo(() => {
    const uniqueTeams: IProTeam[] = [];
    const seenTeamIds = new Set<string>();
    
    athletes.forEach((athlete) => {
      if (!seenTeamIds.has(athlete.team.athstat_id)) {
        seenTeamIds.add(athlete.team.athstat_id);
        uniqueTeams.push(athlete.team);
      }
    });
    
    return uniqueTeams;
  }, [athletes]);

  // Memoize positions extraction for better performance
  const positions = useMemo(() => {
    const uniquePositions = new Set<string>();
    
    athletes.forEach((athlete) => {
      if (athlete.position) {
        uniquePositions.add(athlete.position);
      }
    });
    
    return Array.from(uniquePositions);
  }, [athletes]);

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
