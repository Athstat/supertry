interface PlayerStats {
  tries: number;
  assists: number;
  tackles: number;
  lineBreaks: number;
  carryMeters: number;
  offloads: number;
  missedTackles: number;
  turnoversWon: number;
  kicksFromHand: number;
  goalKickingAccuracy: number;
  penaltiesConceded: number;
  yellowCards: number;
  redCards: number;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  price: number;
  points: number;
  image_url?: string;
  power_rank_rating?: number;

  // Super Sub flag
  is_super_sub?: boolean;

  // Stats from the database schema
  points_kicking?: number;
  tackling?: number;
  infield_kicking?: number;
  strength?: number;
  playmaking?: number;
  ball_carrying?: number;

  // Additional stats we'll keep for UI display
  tries?: number;
  assists?: number;
  tackles?: number;
  nextFixture?: string;

  // These can be derived or generated for UI purposes
  try_scoring?: number;
  offloading?: number;
  breakdown_work?: number;
  defensive_positioning?: number;
  goal_kicking?: number;
  tactical_kicking?: number;
  penalties_conceded?: number;
  discipline?: number;
  cards?: number;
}
