export interface RugbyPlayer {
  id: string;
  tracking_id?: string;
  player_name: string;
  team_name: string;
  position_class: string;
  power_rank_rating: number;
  image_url?: string;
  team_logo?: string;
  trending?: boolean;
  isNew?: boolean;
  stats: {
    tries: number;
    tackles: number;
    missedTackles: number;
    carryMeters: number;
    lineBreaks: number;
    kicksFromHand: number;
    goalKickingAccuracy: number;
    rucksWon: number;
    turnoversWon: number;
    passes: number;
    offloads: number;
    assists: number;
  };
}
