import { PlayerForm } from './rugbyPlayer';
import { IProTeam } from './team';

export type Gender = 'M' | 'F';

export type PositionClass = 'front-row' | 'second-row' | 'back-row'
  | 'half-back' | 'back' | 'super-sub';

/** Type Defination for a professional player */
export type IProAthlete = {
  tracking_id: string;
  source_id?: string;
  player_name: string;
  nick_name?: string;
  birth_country?: string;
  date_of_birth?: Date;
  isactive?: boolean;
  abbr?: string;
  athstat_firstname?: string;
  athstat_lastname?: string;
  athstat_middleinitial?: string;
  general_comments?: string;
  age?: number;
  height?: number;
  weight?: number;
  best_match_full_name?: string;
  best_match_first_name?: string;
  best_match_last_name?: string;
  best_match_team?: string;
  best_match_gender?: string;
  external_source?: string;
  best_match_iaaid?: string;
  unified_id?: string;
  hidden?: boolean;
  gender?: Gender;
  price?: number;
  power_rank_rating?: number;
  region?: string;
  position_class?: string;
  data_source?: string;
  position?: string;
  on_dark_image_url?: string;
  on_light_image_url?: string;
  image_url?: string;
  nationality?: string;
  birth_place?: string;
  form?: PlayerForm;
  available?: boolean;
  team_id: string;
  team?: IProTeam;
  scouting_report?: string
};

export type IAthleteSeasonStarRatings = {
  season_id: string;
  athlete_id: string;
  points_kicking?: number;
  tackling?: number;
  infield_kicking?: number;
  strength?: number;
  playmaking?: number;
  ball_carrying?: number;
  lineout?: number;
  receiving?: number;
  scoring?: number;
  attacking?: number;
  defence?: number;
  kicking?: number;
};

export type PlayerCompareMode = "none" | "picking" | "modal";
export type CardTier = 'gold' | 'silver' | 'bronze' | 'blue';
