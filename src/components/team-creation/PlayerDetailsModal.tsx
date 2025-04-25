import React, { useState, useRef, useEffect } from "react";
import {
  Target,
  Zap,
  Shield,
  Trophy,
  User,
  ChevronDown,
  ChevronUp,
  Award,
  Flame,
  Star as StarIcon,
  Crosshair,
  Dumbbell,
  ArrowLeft,
  Plus,
  Coins,
} from "lucide-react";
import { Player } from "../../types/player";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  Variant,
} from "framer-motion";

// Animation variants for shared element transition
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 20,
    transition: {
      duration: 0.3,
    },
  },
};

// Speed up image loading - no delay for the header image
const headerImageVariants = {
  hidden: { opacity: 1 }, // Start with full opacity for immediate visibility
  visible: {
    opacity: 1,
    transition: {
      duration: 0.1,
    },
  },
};

// Custom content animation variants
const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      delay: custom * 0.05,
    },
  }),
};

// Determine card tier based on power ranking
const getCardTier = (rating: number): "common" | "rare" | "elite" => {
  if (rating >= 85) return "elite";
  if (rating >= 75) return "rare";
  return "common";
};

// Get background gradient based on tier
const getCardBackground = (tier: "common" | "rare" | "elite"): string => {
  switch (tier) {
    case "elite":
      return "bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700";
    case "rare":
      return "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600";
    default:
      return "bg-gradient-to-br from-slate-500 via-gray-500 to-slate-600";
  }
};

// Get badge background based on tier
const getBadgeBackground = (tier: "common" | "rare" | "elite"): string => {
  switch (tier) {
    case "elite":
      return "bg-yellow-400 text-yellow-900";
    case "rare":
      return "bg-sky-300 text-sky-900";
    default:
      return "bg-gray-300 text-gray-800";
  }
};

// Determine badge for a stat value
const getBadge = (val: number) => {
  if (val >= 4.5)
    return {
      icon: <Award size={14} />,
      text: "League Leader",
      color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20",
    };
  if (val >= 4)
    return {
      icon: <Flame size={14} />,
      text: "On Fire",
      color: "text-orange-500 bg-orange-100 dark:bg-orange-900/20",
    };
  if (val >= 3.5)
    return {
      icon: <StarIcon size={14} />,
      text: "Rising Star",
      color: "text-blue-500 bg-blue-100 dark:bg-blue-900/20",
    };
  return null;
};

interface PlayerDetailsModalProps {
  player: Player;
  onClose: () => void;
  onBack?: () => void;
  onAdd: (player: Player) => void;
  // Optional layoutId for shared element animation
  layoutId?: string;
}

export function PlayerDetailsModal({
  player,
  onClose,
  onBack,
  onAdd,
  layoutId,
}: PlayerDetailsModalProps) {
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  // State to track if image has loaded - defaults to false
  const [imageLoaded, setImageLoaded] = useState(false);

  // Create refs for each section
  const contentRef = useRef<HTMLDivElement>(null);

  // Determine card tier based on power ranking
  const cardTier = getCardTier(player.power_rank_rating || 0);
  const cardBackground = getCardBackground(cardTier);
  const badgeBackground = getBadgeBackground(cardTier);

  // Group stats by category
  const attackStats = [
    {
      id: "ball_carrying",
      label: "Ball Carrying",
      value: player.ball_carrying || 4.2,
      icon: <Dumbbell className="text-orange-500" size={16} />,
      description: "Ability to make ground with ball in hand and break tackles",
    },
    {
      id: "strength",
      label: "Strength",
      value: player.strength || 3.8,
      icon: <Dumbbell className="text-red-500" size={16} />,
      description: "Physical power in contact situations",
    },
    {
      id: "playmaking",
      label: "Playmaking",
      value: player.playmaking || 3.5,
      icon: <Zap className="text-blue-500" size={16} />,
      description: "Ability to create opportunities and set up teammates",
    },
    // {
    //   id: "try_scoring",
    //   label: "Try Scoring",
    //   value: player.try_scoring || 3.7,
    //   icon: <Trophy className="text-purple-500" size={16} />,
    //   description: "Ability to score tries",
    // },
    // {
    //   id: "offloading",
    //   label: "Offloading",
    //   value: player.offloading || 3.6,
    //   icon: <Zap className="text-indigo-500" size={16} />,
    //   description: "Ability to pass the ball in contact",
    // },
  ];

  const defenseStats = [
    {
      id: "tackling",
      label: "Tackling",
      value: player.tackling || 4.3,
      icon: <Shield className="text-blue-500" size={16} />,
      description: "Ability to bring down opponents effectively",
    },
    // },
    // {
    //   id: "defensive_positioning",
    //   label: "Positioning",
    //   value: player.defensive_positioning || 3.6,
    //   icon: <Target className="text-blue-400" size={16} />,
    //   description: "Ability to position well in defense",
    // },
    // {
    //   id: "breakdown_work",
    //   label: "Breakdown",
    //   value: player.breakdown_work || 3.5,
    //   icon: <Shield className="text-indigo-500" size={16} />,
    //   description: "Effectiveness at the breakdown",
    // },
    // {
    //   id: "discipline",
    //   label: "Discipline",
    //   value: player.discipline || 3.9,
    //   icon: <Shield className="text-green-500" size={16} />,
    //   description: "Avoiding penalties and maintaining discipline",
    // },
  ];

  const kickingStats = [
    {
      id: "points_kicking",
      label: "Points Kicking",
      value: player.points_kicking || 3.9,
      icon: <Crosshair className="text-orange-500" size={16} />,
      description: "Ability to score points through kicking",
    },
    {
      id: "infield_kicking",
      label: "Infield Kicking",
      value: player.infield_kicking || 3.8,
      icon: <Target className="text-cyan-500" size={16} />,
      description: "Tactical kicking ability during open play",
    },
    // {
    //   id: "goal_kicking",
    //   label: "Goal Kicking",
    //   value: player.goal_kicking || 3.7,
    //   icon: <Target className="text-yellow-500" size={16} />,
    //   description: "Accuracy when kicking for goal",
    // },
    // {
    //   id: "tactical_kicking",
    //   label: "Tactical Kicking",
    //   value: player.tactical_kicking || 3.6,
    //   icon: <Target className="text-blue-500" size={16} />,
    //   description: "Ability to use kicks strategically",
    // },
  ];

  // Format PR rating to one decimal place, handle potential null/undefined
  const formattedPR =
    player.power_rank_rating != null
      ? player.power_rank_rating.toFixed(1)
      : "0.0";

  // Preload the image when component mounts
  useEffect(() => {
    if (player.image_url) {
      const img = new Image();
      img.src = player.image_url;
      img.onload = () => setImageLoaded(true);
    } else {
      // No image URL, set as loaded to avoid waiting
      setImageLoaded(true);
    }
  }, [player.image_url]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      >
        <motion.div
          className="bg-white dark:bg-gray-950 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layoutId={layoutId}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Section with Player Image - INCREASED HEIGHT */}
          <motion.div
            className={`${cardBackground} relative overflow-hidden h-[280px]`}
            layoutId={layoutId ? `${layoutId}` : undefined}
          >
            {/* Player Image - Full size background (simplified animation) */}
            <motion.div
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              {player.image_url ? (
                <img
                  src={player.image_url}
                  alt={player.name}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 30px" }}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                  }}
                  // Force image to load with priority
                  loading="eager"
                  // Apply visibility immediately
                  onLoad={() => setImageLoaded(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User size={80} className="text-gray-400" />
                </div>
              )}

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            </motion.div>

            {/* Top navigation - Only Back button */}
            <motion.div
              className="absolute top-3 left-0 right-0 px-3 flex justify-between z-10"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              {/* Back Button - Left */}
              <button
                onClick={onBack || onClose}
                className="p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors text-white"
                aria-label="Back to player list"
              >
                <ArrowLeft size={18} />
              </button>

              {/* Price Badge with Coins Icon - Right */}
              <div
                className={`${badgeBackground} rounded-full min-w-[2.5rem] h-10 px-2 flex items-center justify-center gap-1 font-semibold text-sm shadow-md`}
                aria-label={`Price: ${player.price || 0}`}
              >
                <Coins size={14} />
                <span>{player.price || 0}</span>
              </div>
            </motion.div>

            {/* Remove PR Rating Badge as requested */}

            {/* Player Info at bottom of image */}
            <motion.div
              className="absolute bottom-6 left-0 right-0 px-4 text-center z-10"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
            >
              <h3 className="text-xl font-bold text-white drop-shadow-md">
                {player.name}
              </h3>
              <div className="flex items-center justify-center gap-2 text-white/90 mt-1 text-sm drop-shadow-md">
                <span>{player.position}</span>
                <span>•</span>
                <span>{player.team}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content container with proper padding to ensure button visibility */}
          <div className="flex flex-col relative flex-1 overflow-hidden pb-16">
            {/* Scrollable Content Area with all stats */}
            <div
              ref={contentRef}
              className="flex-1 overflow-y-auto overscroll-contain"
            >
              {/* Attack Section */}
              <div className="px-3 py-3">
                <div className="sticky top-0 py-2 bg-white dark:bg-gray-950 z-10 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800">
                  <Zap className="text-orange-500" size={16} />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Attack
                  </h3>
                </div>
                <div className="pt-2 space-y-0.5">
                  {attackStats.map((stat, index) => (
                    <StatRow key={stat.id} stat={stat} animationIndex={index} />
                  ))}
                </div>
              </div>

              {/* Defense Section */}
              <div className="px-3 py-2">
                <div className="sticky top-0 py-2 bg-white dark:bg-gray-950 z-10 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800">
                  <Shield className="text-blue-500" size={16} />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Defense
                  </h3>
                </div>
                <div className="pt-2 space-y-0.5">
                  {defenseStats.map((stat, index) => (
                    <StatRow
                      key={stat.id}
                      stat={stat}
                      animationIndex={index + attackStats.length}
                    />
                  ))}
                </div>
              </div>

              {/* Kicking Section */}
              <div className="px-3 py-2">
                <div className="sticky top-0 py-2 bg-white dark:bg-gray-950 z-10 flex items-center gap-2 border-b border-gray-100 dark:border-gray-800">
                  <Target className="text-cyan-500" size={16} />
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    Kicking
                  </h3>
                </div>
                <div className="pt-2 space-y-0.5">
                  {kickingStats.map((stat, index) => (
                    <StatRow
                      key={stat.id}
                      stat={stat}
                      animationIndex={
                        index + attackStats.length + defenseStats.length
                      }
                    />
                  ))}
                </div>
              </div>

              {/* No need for extra padding now since we have a fixed button */}
            </div>

            {/* Fixed Button at Bottom with shadow */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 z-30"
              style={{
                boxShadow: "0px -8px 16px -4px rgba(0, 0, 0, 0.15)",
              }}
            >
              <motion.button
                onClick={() => onAdd(player)}
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 overflow-hidden relative"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} />
                <span className="relative z-10">Add to Team</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface StatRowProps {
  stat: {
    id: string;
    label: string;
    value: number;
    icon: React.ReactNode;
    description: string;
  };
  animationIndex: number;
}

// Modified StatRow component with updated layout and star ratings
const StatRow: React.FC<StatRowProps> = ({ stat, animationIndex }) => {
  const [showDescription, setShowDescription] = useState(false);
  const badge = stat.value >= 3.5 ? getBadge(stat.value) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.1 + animationIndex * 0.02,
          duration: 0.2,
        },
      }}
      className="relative"
    >
      <button
        onClick={() => setShowDescription(!showDescription)}
        className="w-full py-2 px-1 flex items-center justify-between rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
        aria-expanded={showDescription}
        aria-controls={`stat-desc-${stat.id}`}
      >
        <div className="flex items-center gap-2 flex-1">
          {stat.icon}
          <span className="text-sm font-medium dark:text-gray-200">
            {stat.label}
          </span>

          {/* Badge directly after the label */}
          {badge && (
            <span
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ml-1.5 ${badge.color}`}
            >
              {badge.icon}
              <span className="whitespace-nowrap">{badge.text}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {/* Star Rating - 5 star icons */}
          <div className="flex space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                size={14}
                className={`${
                  i < Math.floor(stat.value)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Dropdown arrow for description */}
          {showDescription ? (
            <ChevronUp size={14} className="text-gray-400 ml-1" />
          ) : (
            <ChevronDown size={14} className="text-gray-400 ml-1" />
          )}
        </div>
      </button>

      {/* Expandable description */}
      <AnimatePresence>
        {showDescription && (
          <motion.div
            id={`stat-desc-${stat.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 text-xs text-gray-600 dark:text-gray-400">
              {stat.description}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
