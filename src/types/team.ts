export interface Player {
  id: string;
  name: string;
  position: string;
  points: number;
  form: number;
  price: number;
  team: string;
  nextFixture: string;
  isSubstitute?: boolean;
  is_super_sub?: boolean;
  image: string;
}

export interface Team {
  id: string;
  name: string;
  totalPoints: number;
  rank: number;
  players: Player[];
  formation: string;
  matchesPlayed: number;
}
