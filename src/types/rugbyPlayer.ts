export interface RugbyPlayer {
  id: string;
  player_name: string;
  image_url: string;
  position_class: string;
  team_name: string;
  team_logo: string;
  power_rank_rating: number;
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
