import { RugbyPlayer } from "../types/rugbyPlayer";
import { Player } from "../types/player";

export const calculateAttackRating = (player: RugbyPlayer | Player): number => {
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

export const calculateDefenseRating = (
  player: RugbyPlayer | Player
): number => {
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

export const calculateKickingRating = (
  player: RugbyPlayer | Player
): number => {
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

// Helper function to create a player object from a rugby player
export const createPlayerFromRugbyPlayer = (
  rugbyPlayer: RugbyPlayer,
  positionName: string
): Player => {
  return {
    id: rugbyPlayer.id || rugbyPlayer.tracking_id || String(Math.random()),
    name: rugbyPlayer.player_name || "Unknown Player",
    team: rugbyPlayer.team_name || "Unknown Team",
    position: positionName,
    price: rugbyPlayer.price || 0,
    points: rugbyPlayer.power_rank_rating || 0,
    image_url: rugbyPlayer.image_url || "",
    power_rank_rating: rugbyPlayer.power_rank_rating || 0,

    // Database stats (directly from schema)
    points_kicking:
      rugbyPlayer.points_kicking || Number((Math.random() * 2 + 3).toFixed(1)),
    tackling:
      rugbyPlayer.tackling || Number((Math.random() * 2 + 3).toFixed(1)),
    infield_kicking:
      rugbyPlayer.infield_kicking || Number((Math.random() * 2 + 3).toFixed(1)),
    strength:
      rugbyPlayer.strength || Number((Math.random() * 2 + 3).toFixed(1)),
    playmaking:
      rugbyPlayer.playmaking || Number((Math.random() * 2 + 3).toFixed(1)),
    ball_carrying:
      rugbyPlayer.ball_carrying || Number((Math.random() * 2 + 3).toFixed(1)),

    // UI display stats (generated if not available)
    tries: rugbyPlayer.tries || Math.floor(Math.random() * 15),
    assists: rugbyPlayer.assists || Math.floor(Math.random() * 10),
    tackles: rugbyPlayer.tackles || Math.floor(Math.random() * 150 + 50),

    // Derived stats for UI display
    try_scoring:
      rugbyPlayer.try_scoring || Number((Math.random() * 2 + 3).toFixed(1)),
    offloading:
      rugbyPlayer.offloading || Number((Math.random() * 2 + 3).toFixed(1)),
    breakdown_work:
      rugbyPlayer.breakdown_work || Number((Math.random() * 2 + 3).toFixed(1)),
    defensive_positioning:
      rugbyPlayer.defensive_positioning ||
      Number((Math.random() * 2 + 3).toFixed(1)),
    goal_kicking:
      rugbyPlayer.goal_kicking || Number((Math.random() * 2 + 3).toFixed(1)),
    tactical_kicking:
      rugbyPlayer.tactical_kicking ||
      Number((Math.random() * 2 + 3).toFixed(1)),
    penalties_conceded:
      rugbyPlayer.penalties_conceded ||
      Number((Math.random() * 2 + 1).toFixed(1)),
    discipline:
      rugbyPlayer.discipline || Number((Math.random() * 2 + 3).toFixed(1)),
    cards: rugbyPlayer.cards || Number((Math.random() * 2).toFixed(1)),
  };
};
