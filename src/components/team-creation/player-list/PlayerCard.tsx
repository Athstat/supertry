import React, { useState, useEffect, useRef } from "react";
import { User, Zap, Shield, Target } from "lucide-react";
import { motion, useAnimationControls, Variant } from "framer-motion";
import { RugbyPlayer } from "../../../types/rugbyPlayer";
import { StarRating } from "./StarRating";

interface PlayerCardProps {
  player: RugbyPlayer;
  handleSelectPlayer: (player: RugbyPlayer) => void;
  isFirstCard?: boolean;
  layoutId?: string;
}

// Helper functions for calculating ratings
const GLINT_PROBABILITY = 0.1; // 10% chance for a card to show the glint effect

const calculateAttackRating = (player: RugbyPlayer): number => {
  const stats = [
    player.ball_carrying || 0,
    player.try_scoring || 0,
    player.offloading || 0,
    player.playmaking || 0,
    player.strength || 0,
  ];

  const sum = stats.reduce((acc, val) => acc + val, 0);
  return stats.filter(Boolean).length > 0
    ? sum / stats.filter(Boolean).length
    : 0;
};

const calculateDefenseRating = (player: RugbyPlayer): number => {
  const stats = [
    player.tackling || 0,
    player.defensive_positioning || 0,
    player.breakdown_work || 0,
    player.discipline || 0,
  ];

  const sum = stats.reduce((acc, val) => acc + val, 0);
  return stats.filter(Boolean).length > 0
    ? sum / stats.filter(Boolean).length
    : 0;
};

const calculateKickingRating = (player: RugbyPlayer): number => {
  const stats = [
    player.points_kicking || 0,
    player.infield_kicking || 0,
    player.tactical_kicking || 0,
    player.goal_kicking || 0,
  ];

  const sum = stats.reduce((acc, val) => acc + val, 0);
  return stats.filter(Boolean).length > 0
    ? sum / stats.filter(Boolean).length
    : 0;
};

// Determine card tier based on player rating
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

// Get border glow based on tier
const getCardBorder = (tier: "common" | "rare" | "elite"): string => {
  switch (tier) {
    case "elite":
      return "ring-2 ring-purple-400 ring-opacity-80";
    case "rare":
      return "ring-2 ring-blue-400 ring-opacity-70";
    default:
      return "ring-1 ring-gray-400 ring-opacity-50";
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

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  handleSelectPlayer,
  isFirstCard = false,
  layoutId,
}) => {
  // Animation controls for the glinting effect
  const glintControls = useAnimationControls();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Determine if this card should glint - set once at component initialization
  // First card always glints, others based on probability
  const [shouldGlint] = useState(() => {
    // If this is the first card, always return true to ensure it glints
    if (isFirstCard) {
      return true;
    }

    // For other cards, use the probability-based calculation
    // Using player name combined with power ranking and other available properties to create a unique seed
    const uniqueSeed =
      (player.player_name || "") +
      (player.team_name || "") +
      (player.power_rank_rating?.toString() || "");

    // Create a deterministic value between 0-1 based on the seed
    // Using simple string hashing technique to get a value between 0-1
    let hashValue = 0;
    for (let i = 0; i < uniqueSeed.length; i++) {
      hashValue = (hashValue << 5) - hashValue + uniqueSeed.charCodeAt(i);
      hashValue = hashValue & hashValue; // Convert to 32bit integer
    }

    // Normalize to a value between 0-1
    const normalizedValue = Math.abs(hashValue) / 2147483647;

    // Return true if the value is below the threshold
    return normalizedValue < GLINT_PROBABILITY;
  });

  // Special effect for first card - make it glint right after mounting
  useEffect(() => {
    // If this is marked as the first card, trigger animation immediately after a short delay
    if (isFirstCard && !hasAnimated) {
      const timer = setTimeout(() => {
        const animateFirstCardGlint = async () => {
          await glintControls.start("animate");
          setHasAnimated(true);
        };

        animateFirstCardGlint();
      }, 800); // Short delay to allow card to be visible first

      return () => clearTimeout(timer);
    }
  }, [isFirstCard, hasAnimated, glintControls]);

  // Use IntersectionObserver to detect when card is visible
  useEffect(() => {
    // Skip if animation has already played, card shouldn't glint, or browser doesn't support IntersectionObserver
    if (
      hasAnimated ||
      !shouldGlint ||
      !window.IntersectionObserver ||
      !cardRef.current ||
      isFirstCard // Skip this effect for the first card as it has its own animation trigger
    ) {
      return;
    }

    const options = {
      root: null, // Use viewport as root
      rootMargin: "0px",
      threshold: 0.5, // Trigger when at least 50% of card is visible
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;

      // Only trigger animation when card enters viewport
      if (entry.isIntersecting) {
        // To handle the case where cards are already visible on load,
        // we need to track if the card has been invisible before
        if (!hasBeenVisible) {
          setHasBeenVisible(true);
          return;
        }

        // Play animation and mark as animated
        const animateGlint = async () => {
          await glintControls.start("animate");
          setHasAnimated(true);
        };

        animateGlint();

        // Unobserve after animation triggered
        observer.unobserve(entry.target);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [glintControls, hasAnimated, hasBeenVisible, shouldGlint, isFirstCard]);

  // Calculate ratings
  const attackRating = calculateAttackRating(player);
  const defenseRating = calculateDefenseRating(player);
  const kickingRating = calculateKickingRating(player);

  // Round rating values to integers between 0-100
  const attackValue = Math.round(attackRating * 20);
  const defenseValue = Math.round(defenseRating * 20);
  const kickingValue = Math.round(kickingRating * 20);

  // Determine card tier based on power ranking
  const cardTier = getCardTier(player.power_rank_rating || 0);
  const cardBackground = getCardBackground(cardTier);
  const cardBorder = getCardBorder(cardTier);
  const badgeBackground = getBadgeBackground(cardTier);

  // Format PR rating to one decimal place, handle potential null/undefined
  const formattedPR =
    player.power_rank_rating != null
      ? player.power_rank_rating.toFixed(1)
      : "0.0";

  // Glint animation variants
  const glintVariants = {
    initial: {
      clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
      opacity: 0,
    } as Variant,
    animate: {
      clipPath: "polygon(-100% 0, 200% 0, 100% 100%, -200% 100%)",
      opacity: [0, 0.5, 0],
      transition: {
        clipPath: { duration: 1.5, ease: "easeInOut" },
        opacity: {
          times: [0, 0.5, 1],
          duration: 1.5,
          ease: "easeInOut",
        },
      },
    } as Variant,
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl overflow-hidden shadow-xl h-full aspect-[7/8] ${cardBackground}`}
      layoutId={layoutId}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 25px 30px -10px rgba(0, 0, 0, 0.25)",
      }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Glinting light effect */}
      <motion.div
        className="absolute inset-0 z-30 bg-gradient-to-br from-white/0 via-white/70 to-white/0 pointer-events-none"
        initial="initial"
        animate={glintControls}
        variants={glintVariants}
      />

      <button
        onClick={() => handleSelectPlayer(player)}
        className="w-full h-full flex flex-col items-center rounded-2xl overflow-hidden"
        aria-label={`Select ${player.player_name || "player"}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleSelectPlayer(player);
          }
        }}
      >
        {/* Full-size player image background with adjusted positioning */}
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          layoutId={layoutId ? `${layoutId}-image` : undefined}
        >
          {player.image_url ? (
            <img
              src={player.image_url}
              alt={player.player_name || "Player"}
              className="w-full h-full object-cover"
              style={{ objectPosition: "center 30px" }}
              onError={(e) => {
                e.currentTarget.src =
                  "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-2xl">
              <User size={60} className="text-slate-400" />
            </div>
          )}
        </motion.div>

        {/* Top section: Badges - always visible */}
        <div className="absolute top-3 left-0 right-0 px-3 flex justify-between">
          {/* PR Rating Badge - Left */}
          <div
            className={`${badgeBackground} rounded-full w-10 h-10 flex items-center justify-center font-bold text-base shadow-md z-10`}
            aria-label={`Player Rating: ${formattedPR}`}
          >
            {formattedPR}
          </div>

          {/* Price Badge - Right */}
          <div
            className={`${badgeBackground} rounded-full min-w-[2.5rem] h-10 px-2 flex items-center justify-center font-semibold text-sm shadow-md z-10`}
            aria-label={`Price: ${player.price || 0}`}
          >
            {player.price || 0}
          </div>
        </div>

        {/* Glassmorphism background overlay - bottom third (BACKGROUND ONLY) */}
        <div className="absolute bottom-0 left-0 right-0 h-2/5 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-sm z-10 rounded-b-2xl"></div>

        {/* Player Details Content - stacked above the blur */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex flex-col p-3 space-y-2 z-20 rounded-b-2xl"
          layoutId={layoutId ? `${layoutId}-info` : undefined}
        >
          {/* Player Name & Team */}
          <div className="text-center">
            <h3 className="font-bold text-xl text-white truncate px-2">
              {player.player_name || "Unknown Player"}
            </h3>
            <p className="text-sm text-white/70 truncate">
              {player.team_name || "Unknown Team"}
            </p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-2">
            {/* Stat Column Template */}
            {(
              [
                {
                  label: "Attack",
                  value: attackValue,
                  rating: attackRating,
                  Icon: Zap,
                },
                {
                  label: "Defense",
                  value: defenseValue,
                  rating: defenseRating,
                  Icon: Shield,
                },
                {
                  label: "Kicking",
                  value: kickingValue,
                  rating: kickingRating,
                  Icon: Target,
                },
              ] as const
            ).map(({ label, value, rating, Icon }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-start"
              >
                {/* Numeric Value Badge */}
                <div className="flex bg-white/25 rounded-full w-8 h-8 items-center justify-center mb-1">
                  <span className="font-bold text-sm">{value}</span>
                </div>
                {/* Icon + Label */}
                <div className="flex items-center justify-center text-white/80">
                  <Icon size={10} className="mr-1" />
                  <span className="text-xs font-medium">{label}</span>
                </div>
                {/* Star Rating */}
                <div className="scale-75">
                  <StarRating rating={rating} maxRating={5} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
};
