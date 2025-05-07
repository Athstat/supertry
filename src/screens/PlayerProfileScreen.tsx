import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  RulerIcon,
  WeightIcon,
} from "lucide-react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { athleteService } from "../services/athleteService";
import { useAthletes } from "../contexts/AthleteContext";
import PlayerProfileHeader from "../components/players/profile/PlayerProfileHeaders";
import { StatCard } from "../components/shared/StatCard";
import { GroupedStatsGrid } from "../components/shared/GroupedStatsGrid";
import { PlayerProfileSeasonStats } from "../components/players/profile/PlayerProfileSeasonStats";
import { PlayerProfileOverview } from "../components/players/profile/PlayerProfileOverview";
import { useAsync } from "../hooks/useAsync";
import { athleteSportActionsService } from "../services/athleteSportsActions";
import { AthleteSportsActionAggregated } from "../types/sports_actions";
import { PlayerProfileAttack } from "../components/players/profile/PlayerProfileAttack";
import { PlayerProfileKicking } from "../components/players/profile/PlayerProfileKicking";
import { PlayerProfileDefending } from "../components/players/profile/PlayerProfileDefending";

export type StatTab = "overview" | "physical" | "seasonAggregate" | "attack" | "defense" | "kicking";
export type ExpanedStats = Record<string, boolean>;

export const PlayerProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get the ID from URL params
  const [activeTab, setActiveTab] = useState<StatTab>("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedStats, setExpandedStats] = useState<ExpanedStats>({});
  const [player, setPlayer] = useState<RugbyPlayer | null>(
    location.state?.player || null
  );


  const overviewRef = useRef<HTMLDivElement>(null);
  const physicalRef = useRef<HTMLDivElement>(null);
  const seasonAggregateRef = useRef<HTMLDivElement>(null);
  const attackRef = useRef<HTMLDivElement>(null);
  const defenseRef = useRef<HTMLDivElement>(null);
  const kickingRef = useRef<HTMLDivElement>(null);

  const { getAthleteById } = useAthletes();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {

    const fetchPlayer = async () => {

      if (!player && id) {
        try {

          setIsLoading(true);
          setError(null);

          const cachedPlayer = getAthleteById(id);

          if (cachedPlayer) {
            setPlayer(cachedPlayer);
          } else {
            // const data = await athleteService.getAthleteById(id);
            // setPlayer(data);
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to load player"
          );
          console.error("Error fetching player:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPlayer();
  }, [id, player, getAthleteById]);

  // Handle tab click to scroll to the corresponding section
  const handleTabClick = (tab: StatTab) => {
    setActiveTab(tab);

    // Scroll to the selected section with smooth behavior
    const scrollToRef = {
      overview: overviewRef,
      attack: attackRef,
      defense: defenseRef,
      kicking: kickingRef,
      physical: physicalRef,
      seasonAggregate: seasonAggregateRef
    }[tab];

    if (scrollToRef.current) {
      // Add offset for the sticky header (navbar + player header + tabs)
      const yOffset = -250; // Adjusted offset to account for the fixed headers
      const y =
        scrollToRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });
    }
  };

  // Toggle expanded state for a stat
  const toggleStatExpanded = (statId: string) => {
    setExpandedStats((prev) => ({
      ...prev,
      [statId]: !prev[statId],
    }));
  };

  // Determine if a stat deserves a badge

  const fetchData = useCallback(async () => {
    return athleteSportActionsService.getByAthlete(player?.tracking_id ?? "");
  }, []);

  const { data: aggregatedStats, error: aggregatedStatsError, isLoading: isAggregatedStatsLoading } = useAsync<AthleteSportsActionAggregated[]>(fetchData);



  if (isLoading || isAggregatedStatsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900/40 p-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading player...</p>
        </div>
      </div>
    );
  }

  if (error || !player || !aggregatedStats || aggregatedStatsError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900/40 p-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg">
          {error || "Player not found"}
          <button
            onClick={() => navigate("/players")}
            className="mt-4 text-sm font-medium underline block"
          >
            Go back to players
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-dark-900/40 pb-20">

      <PlayerProfileHeader player={player} activeTab={activeTab} handleTabClick={handleTabClick} />

      {/* Content - All sections in one scrollable view with padding to account for fixed headers */}
      <div className="container mx-auto px-4 pt-[180px] pb-6 space-y-8">

        <PlayerProfileOverview ref={overviewRef} player={player} />


        <GroupedStatsGrid title="Physical" ref={physicalRef} >
          {player.height && <StatCard
            label="Height"
            value={`${player.height} cm` || 0}
            icon={<RulerIcon className="text-purple-500" size={20} />}
          />}
          {player.weight && <StatCard
            label="Weight"
            value={`${player.weight} kg` || 0}
            icon={<WeightIcon className="text-yellow-500" size={20} />}
          />}
        </GroupedStatsGrid>


        <PlayerProfileSeasonStats aggregatedStats={aggregatedStats} player={player} ref={seasonAggregateRef} />

        {/* Attack Section */}
        <PlayerProfileAttack
          player={player}
          ref={attackRef}
          toggleStatExpanded={toggleStatExpanded}
          expandedStats={expandedStats}
          aggregatedStats={aggregatedStats}
        />

        {/* Defense Section */}
        <PlayerProfileDefending
          player={player}
          aggregatedStats={aggregatedStats}
          ref={defenseRef}
          expandedStats={expandedStats}
          toggleStatExpanded={toggleStatExpanded}
        />

        <PlayerProfileKicking
          player={player}
          aggregatedStats={aggregatedStats}
          expandedStats={expandedStats}
          toggleStatExpanded={toggleStatExpanded}
          ref={kickingRef}
        />

      </div >
    </main >
  );
};
