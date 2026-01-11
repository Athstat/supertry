export interface Player {
  team_name: string;
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
  ball_carrying?: number;
  tackling?: number;
  points_kicking?: number;
  team_logo?: string
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

export type IProTeam = {
  athstat_id: string,
  source_id: string,
  athstat_name: string,
  data_source?: string,
  source_abbreviation?: string,
  athstat_abbreviation?: string,
  possible_names?: string,
  hidden?: boolean,
  on_dark_image_url?: string,
  on_light_image_url?: string,
  image_url?: string,
  sport: string,
  organization: string
}

export type TeamSeasonLeader = {
  action: string,
  action_count: number,
  athlete_id: string,
  player_name: string,
  image_url?: string,
  athstat_firstname: string,
  athstat_lastname: string,
  power_rank_rating: number,
  position: string,
  nationality?: string,
  price: number,
  team_id: string
}