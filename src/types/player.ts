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
  price?: number;
  points: number;
  image_url?: string;
  // Optional fields to maintain compatibility
  cost?: number;
  pr?: number;
  stats?: any;
  image?: string;
  power_rank_rating?: number;
}
