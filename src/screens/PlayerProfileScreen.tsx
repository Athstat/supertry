import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Shield,
  Zap,
  Target,
  Crosshair,
  Dumbbell,
  Trophy,
  RulerIcon,
  WeightIcon,
} from "lucide-react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { athleteService } from "../services/athleteService";
import { useAthletes } from "../contexts/AthleteContext";
import PlayerProfileHeader from "../components/players/profile/PlayerProfileHeaders";
import { EnhancedStatBar } from "../components/shared/EnhancedStatBar";
import { StatCard } from "../components/shared/StatCard";
import { GroupedStatsGrid } from "../components/shared/GroupedStatsGrid";

export type StatTab = "overview" | "physical" | "seasonAggregate" | "attack" | "defense" | "kicking";

export const PlayerProfileScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Get the ID from URL params
  const [activeTab, setActiveTab] = useState<StatTab>("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<RugbyPlayer | null>(
    location.state?.player || null
  );
  const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>(
    {}
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
            const data = await athleteService.getAthleteById(id);
            setPlayer(data);
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


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900/40 p-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading player...</p>
        </div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900/40 p-4">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg">
          {error || "Player not found"}
          <button
            onClick={() => navigate(-1)}
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

        <GroupedStatsGrid title="Overview" ref={overviewRef} >
          <StatCard
            label="Power Ranking"
            value={player.power_rank_rating || 0}
            icon={<Trophy className="text-purple-500" size={20} />}
          />
          <StatCard
            label="Points"
            value={player.price || 0}
            icon={<Zap className="text-yellow-500" size={20} />}
          />
        </GroupedStatsGrid>


        <GroupedStatsGrid title="Physical" ref={physicalRef} >
          <StatCard
            label="Height"
            value={`${player.height} cm` || 0}
            icon={<RulerIcon className="text-purple-500" size={20} />}
          />
          <StatCard
            label="Weight"
            value={`${player.weight} kg` || 0}
            icon={<WeightIcon className="text-yellow-500" size={20} />}
          />
        </GroupedStatsGrid>


        <GroupedStatsGrid title="Season Stats" ref={seasonAggregateRef} >

        </GroupedStatsGrid>
          

        {/* Attack Section */}
        <div
          ref={attackRef}
          className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
        >
          <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Attack</h2>
          <div className="space-y-4">
            {player.strength !== undefined && (
              <EnhancedStatBar
                id="strength"
                label="Strength"
                value={player.strength}
                maxValue={5}
                icon={<Dumbbell className="text-red-500" size={20} />}
                expanded={expandedStats["strength"] || false}
                onToggle={() => toggleStatExpanded("strength")}
                description="Physical power in contact situations and scrums"
                isExpanded={expandedStats["strength"] || false}
              />
            )}
            {player.playmaking !== undefined && (
              <EnhancedStatBar
                id="playmaking"
                label="Playmaking"
                value={player.playmaking}
                maxValue={5}
                icon={<Target className="text-blue-500" size={20} />}
                expanded={expandedStats["playmaking"] || false}
                onToggle={() => toggleStatExpanded("playmaking")}
                description="Ability to create opportunities and execute strategic plays"
                isExpanded={expandedStats["playmaking"] || false}
              />
            )}
            {player.ball_carrying !== undefined && (
              <EnhancedStatBar
                id="ball_carrying"
                label="Ball Carrying"
                value={player.ball_carrying}
                maxValue={5}
                icon={<Zap className="text-green-500" size={20} />}
                expanded={expandedStats["ball_carrying"] || false}
                onToggle={() => toggleStatExpanded("ball_carrying")}
                description="Effectiveness in advancing with the ball and breaking tackles"
                isExpanded={expandedStats["ball_carrying"] || false}
              />
            )}
          </div>
        </div>

        {/* Defense Section */}
        <div
          ref={defenseRef}
          className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
        >
          <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Defense</h2>
          <div className="space-y-4">
            {player.tackling !== undefined && (
              <EnhancedStatBar
                id="tackling"
                label="Tackling"
                value={player.tackling}
                maxValue={5}
                icon={<Shield className="text-indigo-500" size={20} />}
                expanded={expandedStats["tackling"] || false}
                onToggle={() => toggleStatExpanded("tackling")}
                description="Ability to stop opponents and prevent line breaks"
                isExpanded={expandedStats["tackling"] || false}
              />
            )}
          </div>
        </div>

        {/* Kicking Section */}
        <div
          ref={kickingRef}
          className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md"
        >
          <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Kicking</h2>
          <div className="space-y-4">
            {player.points_kicking !== undefined && (
              <EnhancedStatBar
                id="points_kicking"
                label="Points Kicking"
                value={player.points_kicking}
                maxValue={5}
                icon={<Crosshair className="text-orange-500" size={20} />}
                expanded={expandedStats["points_kicking"] || false}
                onToggle={() => toggleStatExpanded("points_kicking")}
                description="Accuracy and reliability in penalty and conversion kicks"
                isExpanded={expandedStats["points_kicking"] || false}
              />
            )}
            {player.infield_kicking !== undefined && (
              <EnhancedStatBar
                id="infield_kicking"
                label="Infield Kicking"
                value={player.infield_kicking}
                maxValue={5}
                icon={<Target className="text-cyan-500" size={20} />}
                expanded={expandedStats["infield_kicking"] || false}
                onToggle={() => toggleStatExpanded("infield_kicking")}
                description="Tactical kicking ability during open play"
                isExpanded={expandedStats["infield_kicking"] || false}
              />
            )}
          </div>
        </div>
      </div >
    </main >
  );
};