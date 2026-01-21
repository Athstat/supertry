import React, { createContext, useContext, useEffect, useMemo, useState, useTransition } from "react";
import useSWR from "swr";
import { swrFetchKeys } from "../utils/swrKeys";
import { athleteService } from "../services/athletes/athletesService";
import { IProTeam } from "../types/team";
import { IProAthlete } from "../types/athletes";
import { getAthletesSummary } from "../utils/athletes/athleteUtils";
import { useFantasySeasons } from "../hooks/dashboard/useFantasySeasons";
import { IProSeason } from "../types/season";
import { seasonService } from "../services/seasonsService";
import { competitionService } from "../services/competitionsService";

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

  const { selectedSeason } = useFantasySeasons();
  const key = swrFetchKeys.getAllProAthletesKey(selectedSeason);

  const { data: fetchedAthletes, isLoading: loadingAthletes, mutate, error } =
    useSWR(key, () => fetcher(selectedSeason), {
      revalidateOnFocus: false,
      revalidateIfStale: true
    });

  const athletes = useMemo(() => {
    return fetchedAthletes ?? []
  }, [fetchedAthletes]);

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
    await mutate(() => fetcher(selectedSeason));
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


async function fetcher(season?: IProSeason) {
  if (season) {

    const SIX_NATIONS_SEASON_ID = 'a51dc32a-99cb-5df8-bbc4-4c7557ccccc3';

    if (season.id === SIX_NATIONS_SEASON_ID) {
      return (await competitionService.getAthletes(season.competition_id)).filter((a) => {
        return (a.power_rank_rating || 0) > 0;
      });
    }

    return (await seasonService.getSeasonAthletes(season.id)).filter((a) => {
      return (a.power_rank_rating || 0) > 0;
    });;
  }

  return (await athleteService.getAllAthletes()).filter((a) => {
    return (a.power_rank_rating || 0) > 0;
  });
}