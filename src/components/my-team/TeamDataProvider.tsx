import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  IFantasyClubTeam,
  IFantasyTeamAthlete,
} from "../../types/fantasyTeamAthlete";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { Player } from "../../types/team";
import { Position } from "../../types/position";
import { fantasyTeamService  } from "../../services/teamService";
import { leagueService } from "../../services/leagueService";
import { useFetch } from "../../hooks/useFetch";

interface TeamDataContextType {
  team: IFantasyClubTeam | null;
  athletes: IFantasyTeamAthlete[];
  isLoading: boolean;
  error: string | null;
  leagueInfo: IFantasyLeague | null;
  fetchingLeague: boolean;
  teamBudget: number;
  teamAny: any;
  positionList: Position[];
  players: Player[];
  formation: string;
  totalPoints: number;
  matchesPlayed: number;
  averagePR: number;
  setAthletes: React.Dispatch<React.SetStateAction<IFantasyTeamAthlete[]>>;
}

export const TeamDataContext = React.createContext<
  TeamDataContextType | undefined
>(undefined);

interface TeamDataProviderProps {
  children: React.ReactNode;
}

export const TeamDataProvider: React.FC<TeamDataProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const { teamId } = useParams<{ teamId: string }>();
  const { team: locationTeam, athletes: locationAthletes } =
    location.state || {};

  // State management
  const [team, setTeam] = useState<IFantasyClubTeam | null>(
    locationTeam || null
  );
  const [athletes, setAthletes] = useState<IFantasyTeamAthlete[]>(
    locationAthletes || []
  );
  const [isLoading, setIsLoading] = useState(
    !locationTeam || !locationAthletes
  );
  const [error, setError] = useState<string | null>(null);
  const [leagueInfo, setLeagueInfo] = useState<IFantasyLeague | null>(null);
  const [fetchingLeague, setFetchingLeague] = useState(false);
  const [teamBudget, setTeamBudget] = useState<number>(0);

  const {data: league} = useFetch(
    "fantasy-leagues",
    Number.parseInt(team?.league_id ?? "0"),
    leagueService.getLeagueById,
    [team]
  );

  // Fetch team and athletes if not provided in location state
  useEffect(() => {
    const fetchTeamData = async () => {
      if (!teamId) {
        setError("Team ID is missing");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching team data for ID:", teamId);

        // First try to fetch team athletes directly
        const teamAthletes = await fantasyTeamService.fetchTeamAthletes(
          teamId as string
        );
        console.log("Team athletes:", teamAthletes);

        if (teamAthletes && teamAthletes.length > 0) {
          // If we have athletes, we can fetch the team details
          // Use type assertion to handle the function call
          const userTeams = await (fantasyTeamService.fetchUserTeams as any)();
          console.log("User teams:", userTeams);

          let currentTeam = userTeams.find((t: any) => t.id == teamId);

          console.log("currentTeam", currentTeam);

          // If team not found in user teams, create a minimal team object from athlete data
          if (!currentTeam && teamAthletes.length > 0) {
            console.log(
              "Team not found in user teams, creating from athlete data"
            );

            currentTeam = {
              id: teamId,
              name: "My Team", // Default name
              club_id: "", // Default empty club_id
              league_id: "", // Default empty league_id
              official_league_id: "", // Add the official_league_id field
              created_at: new Date(),
              updated_at: new Date(),
              athletes: teamAthletes,
              rank: 0,
              matches_played: 0,
            } as IFantasyClubTeam;
          }

          if (currentTeam) {
            setTeam(currentTeam);
            setAthletes(teamAthletes);
            setError(null);
          } else {
            throw new Error("Team not found");
          }
        } else {
          throw new Error("No athletes found for this team");
        }
      } catch (err) {
        console.error("Failed to fetch team data:", err);
        setError("Failed to load team data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, locationTeam, locationAthletes]);

  // Calculate team budget
  useEffect(() => {
    if (athletes.length > 0) {
      const totalTeamValue = athletes.reduce(
        (sum, athlete: any) => sum + (athlete.price || 0),
        0
      );
      // Assume max budget is 200 for now, adjust as needed
      const maxBudget = 200;
      setTeamBudget(maxBudget - totalTeamValue);
    }
  }, [athletes]);

  // Add useEffect to scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch league information when team data is loaded
  useEffect(() => {
    const fetchLeagueInfo = async () => {
      if (!team) return;

      // Check for both league_id and official_league_id
      const leagueId = team.league_id || team.official_league_id;

      console.log("team", team);

      if (!leagueId) {
        console.log("No league ID found in team data:", team);
        return;
      }

      try {
        setFetchingLeague(true);
        console.log("Fetching league info for ID:", leagueId);

        // First try with the regular method
        let leagueData = null;
        try {
          leagueData = await leagueService.getLeagueById(Number(leagueId));
        } catch (err) {
          console.log(
            "Error with direct league fetch, trying alternative methods"
          );
        }

        // If first method failed, try with participating teams approach
        if (!leagueData) {
          try {
            const teamsInLeague = await leagueService.fetchParticipatingTeams(
              leagueId
            );
            if (teamsInLeague && teamsInLeague.length > 0) {
              // Create a minimal league object with type casting to avoid TypeScript errors
              leagueData = {
                id: leagueId,
                title: teamsInLeague[0]?.name || "My League",
                description: "Fantasy Rugby League",
                current_gameweek: 1,
                // Add additional required properties with default values
                type: "fantasy",
                official_league_id: leagueId.toString(),
                created_date: new Date().toISOString(),
                entry_code: "",
                is_private: false,
                participants_count: teamsInLeague.length,
                reward_type: "",
                total_gameweeks: 0,
              } as unknown as IFantasyLeague;
            }
          } catch (err) {
            console.error("Failed to fetch teams in league:", err);
          }
        }

        if (leagueData) {
          console.log("Successfully fetched league data:", leagueData);
          setLeagueInfo(leagueData);
        } else {
          console.warn("No league data could be found for this team");
        }
      } catch (error) {
        console.error("Failed to fetch league info:", error);
      } finally {
        setFetchingLeague(false);
      }
    };

    fetchLeagueInfo();
  }, [team]);

  // Convert athletes to position format for the Edit Team view
  const positionList = useMemo(() => {
    if (!athletes.length) return [];

    const positions: Position[] = [];

    // Add regular position players (non-super sub)
    athletes
      .filter((athlete: any) => !athlete.is_super_sub)
      .forEach((athlete) => {
        // Handle the TypeScript type issues with any assertions where needed
        const athleteAny = athlete as any;

        positions.push({
          id: athlete.athlete_id || "",
          name: athleteAny.position_class || "Unknown Position",
          shortName: (athleteAny.position_class || "")
            .substring(0, 2)
            .toUpperCase(),
          x: "0",
          y: "0",
          player: {
            id: athleteAny.athlete_id || "",
            name: athleteAny.player_name || "Unknown Player",
            team: athleteAny.athlete?.team?.name || "Unknown Team",
            position: athleteAny.position_class || "Unknown Position",
            price: athleteAny.price || 0,
            points: athleteAny.score || 0,
            power_rank_rating: athleteAny.power_rank_rating || 0,
            image_url: athleteAny.image_url,
          },
        });
      });

    // Add super sub at the end
    const superSub = athletes.find((athlete: any) => athlete.is_super_sub);
    if (superSub) {
      const superSubAny = superSub as any;
      positions.push({
        id: superSub.athlete_id || "",
        name: "Super Sub",
        shortName: "SS",
        x: "0",
        y: "0",
        isSpecial: true,
        player: {
          id: superSubAny.athlete_id || "",
          name: superSubAny.player_name || "Unknown Player",
          team: superSubAny.athlete?.team?.name || "Unknown Team",
          position: superSubAny.position_class || "Unknown Position",
          price: superSubAny.price || 0,
          points: superSubAny.score || 0,
          power_rank_rating: superSubAny.power_rank_rating || 0,
          image_url: superSubAny.image_url,
        },
      });
    }

    return positions;
  }, [athletes]);

  // Convert IFantasyTeamAthlete to Player format for the TeamFormation component
  const convertToPlayerFormat = (athletes: IFantasyTeamAthlete[]): Player[] => {
    return athletes.map((athlete) => {
      // Handle the TypeScript type issues with any assertions where needed
      const athleteAny = athlete as any;

      const isSuperSub = !athleteAny.is_starting;

      return {
        id: athleteAny.athlete_id || "",
        name: athleteAny.player_name || "Unknown Player",
        position: athleteAny.position_class || "Unknown Position",
        position_class: athleteAny.position_class || "Unknown Position",
        team: athleteAny.athlete?.team?.name || "Unknown Team",
        points: athleteAny.price || 0,
        form: athleteAny.power_rank_rating || 0,
        isSubstitute: isSuperSub,
        is_super_sub: isSuperSub,
        is_starting: !isSuperSub,
        image: athleteAny.image_url,
        price: athleteAny.price || 0,
        nextFixture: "", // Add required property with default value
      };
    });
  };

  const players = useMemo(() => convertToPlayerFormat(athletes), [athletes]);

  // Determine formation based on positions for rugby
  const determineFormation = (players: Player[]): string => {
    // Simple formation detection - count players by position for rugby
    const starters = players.filter((p) => !p.isSubstitute);
    const frontRow = starters.filter((p) =>
      p.position.includes("front-row")
    ).length;
    const secondRow = starters.filter((p) =>
      p.position.includes("second-row")
    ).length;
    const backRow = starters.filter((p) =>
      p.position.includes("back-row")
    ).length;
    const halfbacks = starters.filter((p) =>
      p.position.includes("half-back")
    ).length;
    const backs = starters.filter((p) => p.position.includes("back")).length;

    return `${frontRow}-${secondRow}-${backRow}-${halfbacks}-${backs}`;
  };

  const formation = useMemo(() => determineFormation(players), [players]);

  // Calculate average PR
  const calculateAveragePR = (players: Player[]): number => {
    if (!players.length) return 0;
    const totalPR = players.reduce(
      (sum, player) => sum + (player.form || 0),
      0
    );
    return totalPR / players.length;
  };

  const averagePR = useMemo(() => calculateAveragePR(players), [players]);

  // Calculate total points
  const totalPoints = useMemo(
    () => athletes.reduce((sum, athlete) => sum + (athlete.score || 0), 0),
    [athletes]
  );

  // Calculate matches played
  const teamAny = team as any;
  const matchesPlayed = teamAny?.matches_played || 0;

  const value = {
    team,
    athletes,
    isLoading,
    error,
    leagueInfo: league ?? null,
    fetchingLeague,
    teamBudget,
    teamAny,
    positionList,
    players,
    formation,
    totalPoints,
    matchesPlayed,
    averagePR,
    setAthletes,
  };

  return (
    <TeamDataContext.Provider value={value}>
      {children}
    </TeamDataContext.Provider>
  );
};

export const useTeamData = () => {
  const context = React.useContext(TeamDataContext);
  if (context === undefined) {
    throw new Error("useTeamData must be used within a TeamDataProvider");
  }
  return context;
};
