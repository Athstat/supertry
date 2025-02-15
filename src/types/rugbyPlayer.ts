export interface RugbyPlayer {
  id: string;
  name: string;
  position: string;
  nationality: string;
  club: string;
  image: string;
  fantasyPoints: number;
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
