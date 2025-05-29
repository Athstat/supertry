export interface Player {
  team_name: any;
  id: string;
  name: string;
  position: string;
  position_class: string;
  is_starting: boolean;
  points: number;
  form: number;
  price: number;
  team: string;
  nextFixture: string;
  isSubstitute?: boolean;
  is_super_sub?: boolean;
  image: string;
  image_url?: string;
  athlete_id: string;
  player_name: string;
  tracking_id?: string;
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
