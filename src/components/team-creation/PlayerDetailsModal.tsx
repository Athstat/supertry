import React, { useState, useRef } from "react";
import {
  X,
  Target,
  Zap,
  Shield,
  Trophy,
  User,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  Star,
  TrendingUp,
  Crosshair,
  Dumbbell,
} from "lucide-react";
import { Player } from "../../types/player";
import { motion, AnimatePresence } from "framer-motion";

type StatTab = "overview" | "attack" | "defense" | "kicking" | "discipline";

interface PlayerDetailsModalProps {
  player: Player;
  onClose: () => void;
  onAdd: (player: Player) => void;
}

export function PlayerDetailsModal({
  player,
  onClose,
  onAdd,
}: PlayerDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<StatTab>("overview");
  const [expandedStats, setExpandedStats] = useState<Record<string, boolean>>(
    {}
  );

  // Create refs for each section
  const overviewRef = useRef<HTMLDivElement>(null);
  const attackRef = useRef<HTMLDivElement>(null);
  const defenseRef = useRef<HTMLDivElement>(null);
  const kickingRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Toggle expanded state for a stat
  const toggleStatExpanded = (statId: string) => {
    setExpandedStats((prev) => ({
      ...prev,
      [statId]: !prev[statId],
    }));
  };

  // Handle tab click to scroll to the corresponding section
  const handleTabClick = (tab: StatTab) => {
    setActiveTab(tab);

    // Scroll to the selected section with smooth behavior
    const scrollToRef = {
      overview: overviewRef,
      attack: attackRef,
      defense: defenseRef,
      kicking: kickingRef,
      discipline: null, // Add this to match the StatTab type
    }[tab];

    if (scrollToRef?.current && contentRef.current) {
      const yOffset = 20; // Small offset from the top
      contentRef.current.scrollTo({
        top: scrollToRef.current.offsetTop - yOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-950 rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold">Player Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {player.image_url ? (
                <img
                  src={player.image_url}
                  alt={player.name}
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src =
                      "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                  }}
                />
              ) : (
                <User size={32} className="text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold">{player.name}</h3>
              <div className="flex items-center gap-2 text-white/80">
                <span>{player.position}</span>
                <span>•</span>
                <span>{player.team}</span>
              </div>
              <div className="mt-1">
                <span className="font-semibold text-white">
                  {player.points} points
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Tabs */}
        <div className="flex h-[100px] justify-between bg-white dark:bg-gray-950 shadow-md border-b border-gray-100 dark:border-gray-800 overflow-x-auto relative z-10">
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

        {/* Scrollable Content Area */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 relative z-0"
        >
          {/* Overview Section - Updated to match PlayerProfileScreen */}
          <div
            ref={overviewRef}
            className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-3"
          >
            <h2 className="text-lg font-bold mb-3 dark:text-gray-100">
              Overview
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="text-purple-500" size={18} />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Power Ranking
                  </span>
                </div>
                <div className="text-2xl font-bold dark:text-gray-100">
                  {player.power_rank_rating || 0}
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="text-yellow-500" size={20} />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Points
                  </span>
                </div>
                <div className="text-2xl font-bold dark:text-gray-100">
                  {player.price || 12}
                </div>
              </div>
            </div>
          </div>

          {/* Attack Section - Only database stats */}
          <div
            ref={attackRef}
            className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-3"
          >
            <h2 className="text-lg font-bold mb-3 dark:text-gray-100">
              Attack
            </h2>
            <div className="space-y-3">
              <EnhancedStatBar
                id="ball_carrying"
                label="Ball Carrying"
                value={player.ball_carrying || 4.2}
                maxValue={5}
                icon={<Dumbbell className="text-orange-500" size={18} />}
                description="Ability to make ground with ball in hand and break tackles"
                isExpanded={expandedStats["ball_carrying"] || false}
                onToggle={() => toggleStatExpanded("ball_carrying")}
              />
              <EnhancedStatBar
                id="strength"
                label="Strength"
                value={player.strength || 3.8}
                maxValue={5}
                icon={<Dumbbell className="text-red-500" size={18} />}
                description="Physical power in contact situations"
                isExpanded={expandedStats["strength"] || false}
                onToggle={() => toggleStatExpanded("strength")}
              />
              <EnhancedStatBar
                id="playmaking"
                label="Playmaking"
                value={player.playmaking || 3.5}
                maxValue={5}
                icon={<Zap className="text-blue-500" size={18} />}
                description="Ability to create opportunities and set up teammates"
                isExpanded={expandedStats["playmaking"] || false}
                onToggle={() => toggleStatExpanded("playmaking")}
              />
            </div>
          </div>

          {/* Defense Section - Only database stats */}
          <div
            ref={defenseRef}
            className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-3"
          >
            <h2 className="text-lg font-bold mb-3 dark:text-gray-100">
              Defense
            </h2>
            <div className="space-y-3">
              <EnhancedStatBar
                id="tackling"
                label="Tackling"
                value={player.tackling || 4.3}
                maxValue={5}
                icon={<Shield className="text-blue-500" size={18} />}
                description="Ability to bring down opponents effectively"
                isExpanded={expandedStats["tackling"] || false}
                onToggle={() => toggleStatExpanded("tackling")}
              />
            </div>
          </div>

          {/* Kicking Section - Only database stats */}
          <div
            ref={kickingRef}
            className="bg-white dark:bg-dark-800/40 rounded-xl shadow-sm p-3"
          >
            <h2 className="text-lg font-bold mb-3 dark:text-gray-100">
              Kicking
            </h2>
            <div className="space-y-3">
              <EnhancedStatBar
                id="points_kicking"
                label="Points Kicking"
                value={player.points_kicking || 3.9}
                maxValue={5}
                icon={<Crosshair className="text-orange-500" size={18} />}
                description="Ability to score points through kicking"
                isExpanded={expandedStats["points_kicking"] || false}
                onToggle={() => toggleStatExpanded("points_kicking")}
              />
              <EnhancedStatBar
                id="infield_kicking"
                label="Infield Kicking"
                value={player.infield_kicking || 3.8}
                maxValue={5}
                icon={<Target className="text-cyan-500" size={18} />}
                description="Tactical kicking ability during open play"
                isExpanded={expandedStats["infield_kicking"] || false}
                onToggle={() => toggleStatExpanded("infield_kicking")}
              />
            </div>
          </div>
        </div>

        {/* Fixed Button at Bottom */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
          <button
            onClick={() => onAdd(player)}
            className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            Add to Team
          </button>
        </div>
      </div>
    </div>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-3 font-medium whitespace-nowrap border-b-2 transition-colors flex-1 text-center ${
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

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <div className="bg-gray-50 dark:bg-dark-700/50 rounded-lg p-4 transition-all duration-300 hover:shadow-md">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {label}
      </span>
    </div>
    <div className="text-2xl font-bold dark:text-gray-100">{value}</div>
  </div>
);

interface EnhancedStatBarProps {
  id: string;
  label: string;
  value: number;
  maxValue: number;
  icon: React.ReactNode;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  inverse?: boolean;
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
  inverse = false,
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

          {badge && !inverse && (
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
              i < value
                ? inverse
                  ? "text-red-500"
                  : "text-green-500"
                : "text-gray-300 dark:text-gray-600"
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
      {/* <div className="h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`h-full ${
            inverse
              ? "bg-gradient-to-r from-red-400 to-red-600 dark:from-red-500 dark:to-red-700"
              : "bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700"
          }`}
        />
      </div> */}

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

              {!inverse && value >= 4 && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-green-700 dark:text-green-400 text-xs">
                  <TrendingUp size={14} className="inline mr-1" />
                  This is one of {label.toLowerCase()}'s strongest attributes.
                </div>
              )}

              {!inverse && value <= 2 && (
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-amber-700 dark:text-amber-400 text-xs">
                  <TrendingUp size={14} className="inline mr-1" />
                  This is an area where {label.toLowerCase()} could be improved.
                </div>
              )}

              {inverse && value <= 2 && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-green-700 dark:text-green-400 text-xs">
                  <TrendingUp size={14} className="inline mr-1" />
                  Player has excellent discipline in this area.
                </div>
              )}

              {inverse && value >= 4 && (
                <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-amber-700 dark:text-amber-400 text-xs">
                  <TrendingUp size={14} className="inline mr-1" />
                  This is an area of concern for this player.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
