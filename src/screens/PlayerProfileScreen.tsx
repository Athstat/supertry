import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  RulerIcon,
  WeightIcon,
} from "lucide-react";
import { athleteService } from "../services/athleteService";
import PlayerProfileHeader from "../components/players/profile/PlayerProfileHeaders";
import { StatCard } from "../components/shared/StatCard";
import { GroupedStatsGrid } from "../components/shared/GroupedStatsGrid";
import { PlayerProfileSeasonStats } from "../components/players/profile/PlayerProfileSeasonStats";
import { PlayerProfileOverview } from "../components/players/profile/PlayerProfileOverview";
import { useFetch } from "../hooks/useAsync";
import { athleteSportActionsService } from "../services/athleteSportsActions";
import { PlayerProfileAttack } from "../components/players/profile/PlayerProfileAttack";
import { PlayerProfileKicking } from "../components/players/profile/PlayerProfileKicking";
import { PlayerProfileDefending } from "../components/players/profile/PlayerProfileDefending";
import { ErrorState } from "../components/ui/ErrorState";

export type StatTab = "overview" | "physical" | "seasonAggregate" | "attack" | "defense" | "kicking";
export type ExpanedStats = Record<string, boolean>;

export const PlayerProfileScreen = () => {
  const navigate = useNavigate();
  const { playerId } = useParams();
  const [activeTab, setActiveTab] = useState<StatTab>("overview");

  const [expandedStats, setExpandedStats] = useState<ExpanedStats>({});
  const {data: player, isLoading, error} = useFetch("athlete", playerId ?? "fallback", athleteService.getRugbyAthleteById);

  const overviewRef = useRef<HTMLDivElement>(null);
  const physicalRef = useRef<HTMLDivElement>(null);
  const seasonAggregateRef = useRef<HTMLDivElement>(null);
  const attackRef = useRef<HTMLDivElement>(null);
  const defenseRef = useRef<HTMLDivElement>(null);
  const kickingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!playerId) return <ErrorState message="Athlete was not found" />


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

  const { data: stats, error: statsError, isLoading: isLoadingStats } = useFetch("ath-stats", playerId, athleteSportActionsService.getByAthlete);

  if (isLoading || isLoadingStats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900/40 p-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading player...</p>
        </div>
      </div>
    );
  }

  if (error || !player || !stats || statsError) {
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


        <PlayerProfileSeasonStats aggregatedStats={stats} player={player} ref={seasonAggregateRef} />

        {/* Attack Section */}
        <PlayerProfileAttack
          player={player}
          ref={attackRef}
          toggleStatExpanded={toggleStatExpanded}
          expandedStats={expandedStats}
          aggregatedStats={stats}
        />

        {/* Defense Section */}
        <PlayerProfileDefending
          player={player}
          aggregatedStats={stats}
          ref={defenseRef}
          expandedStats={expandedStats}
          toggleStatExpanded={toggleStatExpanded}
        />

        <PlayerProfileKicking
          player={player}
          aggregatedStats={stats}
          expandedStats={expandedStats}
          toggleStatExpanded={toggleStatExpanded}
          ref={kickingRef}
        />

      </div >
    </main >
  );
};