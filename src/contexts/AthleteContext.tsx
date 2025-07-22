import React, { createContext, useContext, useEffect, useState, useTransition } from "react";
import useSWR from "swr";
import { swrFetchKeys } from "../utils/swrKeys";
import { djangoAthleteService } from "../services/athletes/djangoAthletesService";
import { IProTeam } from "../types/team";
import { IProAthlete } from "../types/athletes";
import { getAthletesSummary } from "../utils/athleteUtils";

interface AthleteContextType {
  athletes: IProAthlete[];
  isLoading: boolean;
  error: string | null;
  refreshAthletes: () => Promise<void>;
  getAthleteById: (id: string) => IProAthlete | undefined;
  positions: string[];
  teams: IProTeam[];
  isTeamsAndPositionsPending: boolean
}

const AthleteContext = createContext<AthleteContextType | undefined>(undefined);

export const AthleteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const key = swrFetchKeys.getAllProAthletesKey();
  const { data: fetchedAthletes, isLoading: loadingAthletes, mutate, error } = useSWR(key, () => djangoAthleteService.getAllAthletes());

  const athletes = fetchedAthletes ?? [];
  const isLoading = loadingAthletes;

  const [teams, setTeams] = useState<IProTeam[]>([]);
  const [positions, setPositions] = useState<string[]>([]);

  const [isTeamsAndPositionsPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      const { teams: _teams, positions: _positions } = getAthletesSummary(athletes);
      setTeams(_teams);
      setPositions(_positions)
    });
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
        isTeamsAndPositionsPending
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
