import React, { createContext, useContext, useState, useEffect } from "react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { athleteService } from "../services/athleteService";

// Default competition ID
const DEFAULT_COMPETITION_ID = "7f6ac8a5-1723-5325-96bd-44b8b36cfb9e";

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

export const AthleteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [athletes, setAthletes] = useState<RugbyPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [positions, setPositions] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  const fetchAthletes = async (forceRefresh = false) => {
    // Skip fetching if we already have data and it's not a forced refresh
    const now = Date.now();
    const cacheExpired = lastFetchTime
      ? now - lastFetchTime > 5 * 60 * 1000
      : true;

    if (athletes.length > 0 && !forceRefresh && !cacheExpired) {
      return; // Use cached athletes
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await athleteService.getRugbyAthletesByCompetition(
        DEFAULT_COMPETITION_ID
      );
      setAthletes(data);
      setLastFetchTime(now);

      // Extract unique positions and teams for filters
      const extractedPositions = [
        ...new Set(
          data.map((player) => {
            const position = player.position_class || "";
            return position.charAt(0).toUpperCase() + position.slice(1);
          })
        ),
      ]
        .filter(Boolean)
        .sort();

      const extractedTeams = [
        ...new Set(data.map((player) => player.team_name)),
      ]
        .filter(Boolean)
        .sort();

      setPositions(extractedPositions);
      setTeams(extractedTeams);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load athletes");
      console.error("Error fetching athletes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchAthletes();
  }, []);

  const refreshAthletes = () => fetchAthletes(true);

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

export const useAthletes = () => {
  const context = useContext(AthleteContext);
  if (context === undefined) {
    throw new Error("useAthletes must be used within an AthleteProvider");
  }
  return context;
};
