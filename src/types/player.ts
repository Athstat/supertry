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
  position: string;
  points: number;
  cost: number;
  pr: number;
  team: string;
  image: string;
  stats: PlayerStats;
}
