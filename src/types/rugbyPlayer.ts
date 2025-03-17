export interface RugbyPlayer {
  id?: string;
  tracking_id?: string;
  player_name?: string;
  position_class?: string;
  team_name?: string;
  image_url?: string;
  power_rank_rating?: number;
  price?: number;
  team_logo?: string;
  trending?: boolean;
  isNew?: boolean;
  stats?: {
    tries?: number;
    tackles?: number;
    missedTackles?: number;
    carryMeters?: number;
    lineBreaks?: number;
    kicksFromHand?: number;
    goalKickingAccuracy?: number;
    rucksWon?: number;
    turnoversWon?: number;
    passes?: number;
    offloads?: number;
    assists?: number;
  };
}
