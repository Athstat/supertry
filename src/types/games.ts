export type IFixture = {
  game_id: string;
  team_score?: number;
  opposition_score?: number;
  venue?: string;
  kickoff_time?: Date;
  competition_name?: string;
  team_id: string;
  opposition_team_id: string;
  is_knockout?: boolean;
  is_league_managed?: boolean;
  location?: string;
  extra_info?: string;
  hidden?: boolean;
  league_id: string;
  network?: string;
  game_status?: GameStatus;
  game_clock?: string;
  result?: string;
  source_id?: string;
  data_source?: string;
  is_test?: boolean;
  round: number;
  team_name: string;
  team_image_url?: string;
  opposition_team_name?: string;
  opposition_image_url?: string;
  opposition_team_image_url?: string;
};

export type GameStatus = string | 'completed' | 'in_progress' | 'not_started';

export type IFullFixture = any;

export type IGameVote = {
  id: number;
  game_id: string;
  user_id: string;
  vote_for: 'home_team' | 'away_team';
  created_at: string;
  updated_at: string;
  user_name?: string;
};

/** Represents a single record of an athlete in a teams roster for a
 * certain game thats being played
 */

export type IRosterItem = {
  player_number: number;
  is_captain?: boolean;
  is_substitute: boolean;
  game_id: string;
  team_id: string;
  athlete_id: string;
  position: string;
  source_id: string;
  tracking_id: string;
  player_name?: string;
  nick_name?: string;
  birth_country?: string;
  date_of_birth?: Date;
  isactive?: boolean;
  athstat_firstname?: string;
  athstat_lastname?: string;
  athstat_middleinitial?: string;
  general_comments?: string;
  age?: number;
  height?: number;
  weight?: number;
  hidden?: boolean;
  gender?: 'M' | 'F';
  price?: number;
  power_rank_rating?: number;
  position_class?: string;
  data_source?: string;
  image_url?: string;
  nationality?: string;
  birth_place?: string;
  form?: string;
  available?: boolean;
  team_image_url?: string;
  team_name?: string;
};
