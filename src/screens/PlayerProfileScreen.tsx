import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  Trophy,
  Shield,
  Zap,
  Target,
  Crosshair,
  Dumbbell,
  ChevronDown,
  ChevronUp,
  Award,
  TrendingUp,
  Flame,
  Star,
} from "lucide-react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { athleteService } from "../services/athleteService";
import { motion, AnimatePresence } from "framer-motion";
import { useAthletes } from "../contexts/AthleteContext";

type StatTab = "overview" | "attack" | "defense" | "kicking";

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

  // Create refs for each section
  const overviewRef = useRef<HTMLDivElement>(null);
  const attackRef = useRef<HTMLDivElement>(null);
  const defenseRef = useRef<HTMLDivElement>(null);
  const kickingRef = useRef<HTMLDivElement>(null);

  const { getAthleteById } = useAthletes();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch player data if not available in navigation state
  useEffect(() => {
    const fetchPlayer = async () => {
      if (!player && id) {
        try {
          setIsLoading(true);
          setError(null);

          // Try to get from context first
          const cachedPlayer = getAthleteById(id);

          if (cachedPlayer) {
            setPlayer(cachedPlayer);
          } else {
            // Fallback to API call if not in context
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
  const getStatBadge = (statName: string, value: number) => {
    if (value >= 4.5)
      return {
        icon: <Award size={16} className="text-yellow-500" />,
        label: "League Leader",
      };
    if (value >= 4)
      return {
        icon: <Flame size={16} className="text-orange-500" />,
        label: "On Fire",
      };
    if (value >= 3.5)
      return {
        icon: <Star size={16} className="text-blue-500" />,
        label: "Rising Star",
      };
    return null;
  };

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
      {/* Fixed Header - positioned right below the navbar */}
      <div className="fixed top-[60px] left-0 right-0 z-30">
        {/* Player Info Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md">
          <div className="container mx-auto px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-2"
              aria-label="Go back to players"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && navigate(-1)}
            >
              <ChevronLeft size={20} />
              Back to Players
            </button>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                <img
                  src={player.image_url}
                  alt={player.player_name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">{player.player_name}</h1>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>
                    {player.position_class
                      ? player.position_class
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")
                      : ""}
                  </span>
                  <span>•</span>
                  <span>{player.team_name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white dark:bg-dark-800 shadow-sm">
          <div className="container mx-auto">
            <div className="flex overflow-x-auto">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => handleTabClick("overview")}
              >
                Overview
              </TabButton>
              <TabButton
                active={activeTab === "attack"}
                onClick={() => handleTabClick("attack")}
              >
                Attack
              </TabButton>
              <TabButton
                active={activeTab === "defense"}
                onClick={() => handleTabClick("defense")}
              >
                Defense
              </TabButton>
              <TabButton
                active={activeTab === "kicking"}
                onClick={() => handleTabClick("kicking")}
              >
                Kicking
              </TabButton>
            </div>
          </div>
        </div>
      </div>

      {/* Content - All sections in one scrollable view with padding to account for fixed headers */}
      <div className="container mx-auto px-4 pt-[180px] pb-6 space-y-8">
        {/* Overview Section */}
        <div
          ref={overviewRef}
          className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold mb-4 dark:text-gray-100">
            Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
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
          </div>
        </div>

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
      </div>
    </main>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
      active
        ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
        : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
    }`}
    aria-label={`View ${children} tab`}
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onClick()}
  >
    {children}
  </button>
);

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
      <div className="flex items-center">
        <div className="text-2xl font-bold dark:text-gray-100 mr-2">
          {value}
        </div>
      </div>
    </div>
  );
};

interface EnhancedStatBarProps {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  expanded?: boolean;
}

const EnhancedStatBar = ({
  id,
  label,
  value,
  maxValue,
  icon,
  description,
  isExpanded,
  onToggle,
}: EnhancedStatBarProps) => {
  const percentage = (value / maxValue) * 100;
  const badge = value >= 3.5 ? getBadge(value) : null;

  function getBadge(val: number) {
    if (val >= 4.5)
      return {
        icon: <Award size={16} />,
        text: "League Leader",
        color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20",
      };
    if (val >= 4)
      return {
        icon: <Flame size={16} />,
        text: "On Fire",
        color: "text-orange-500 bg-orange-100 dark:bg-orange-900/20",
      };
    if (val >= 3.5)
      return {
        icon: <Star size={16} />,
        text: "Rising Star",
        color: "text-blue-500 bg-blue-100 dark:bg-blue-900/20",
      };
    return null;
  }

  return (
    <div className="space-y-2 bg-white dark:bg-dark-800/60 rounded-lg p-3 transition-all duration-300 hover:shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between cursor-pointer"
        aria-expanded={isExpanded}
        aria-controls={`stat-details-${id}`}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-medium dark:text-gray-300">
            {label}
          </span>

          {badge && (
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${badge.color}`}
            >
              {badge.icon}
              <span>{badge.text}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium dark:text-gray-300">
            {value}/5
          </span>
          {isExpanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </button>

      {/* Star Rating */}
      <div className="flex space-x-1">
        {[...Array(maxValue)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{
              scale: i < value ? 1 : 0.8,
              opacity: i < value ? 1 : 0.5,
            }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={`w-5 h-5 ${
              i < value ? "text-green-500" : "text-gray-300 dark:text-gray-600"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path d="M12 .587l3.668 7.568 8.332 1.207-6.004 5.848 1.417 8.267L12 18.896l-7.413 3.895 1.417-8.267-6.004-5.848 8.332-1.207L12 .587z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700"
        />
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`stat-details-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 mt-2">
              <p>{description}</p>

              {value >= 4 && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-green-700 dark:text-green-400 text-xs">
                  <TrendingUp size={14} className="inline mr-1" />
                  This is one of {label.toLowerCase()}'s strongest attributes.
                </div>
              )}

              {value <= 2 && (
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-amber-700 dark:text-amber-400 text-xs">
                  <TrendingUp size={14} className="inline mr-1" />
                  This is an area where {label.toLowerCase()} could be improved.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
