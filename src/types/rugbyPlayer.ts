export interface RugbyPlayer {
  id?: string;
  tracking_id?: string;
  player_name?: string;
  team_name?: string;
  position_class?: string;
  price?: number;
  power_rank_rating?: number;
  image_url?: string;
  height?: number;
  weight?: number;
  date_of_birth?: Date;
  team_logo?: string;
  is_starting?: boolean;

  // Stats
  ball_carrying?: number;
  try_scoring?: number;
  offloading?: number;
  playmaking?: number;
  strength?: number;
  tackling?: number;
  defensive_positioning?: number;
  breakdown_work?: number;
  discipline?: number;
  points_kicking?: number;
  infield_kicking?: number;
  tactical_kicking?: number;
  goal_kicking?: number;
  scoring: number;
  defence: number;
  attacking: number;
  kicking?: number; // Added kicking field to replace scoring in UI

  // UI display stats
  tries?: number;
  assists?: number;
  tackles?: number;
  penalties_conceded?: number;
  cards?: number;
  team_id?: string;
  form?: PlayerForm;
  available?: boolean;
  position?: string;
}

export type IFantasyAthlete = {
  source_id?: string;
  tracking_id: string;
  player_name?: string;
  nick_name?: string;
  birth_country?: string;
  date_of_birth?: Date;
  isactive?: boolean;
  abbr?: string;
  athstat_name: string;
  athstat_firstname: string;
  athstat_lastname: string;
  athstat_middleinitial: string;
  general_comments?: string;
  team_id: string;
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
  kc_id?: string;
  kcsynced?: boolean;
  gender?: 'M' | 'F';
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
  available?: string;

  // Rugby stats fields from RugbyAthlete model
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

export type PlayerForm = 'UP' | 'DOWN' | 'NEUTRAL';

export type RugbyPlayerShort = {
  id: string;
  name: string;
  team: string;
  position: string;
  price: number;
  points: number;
  image_url?: string;
  power_rank_rating?: number;
  points_kicking?: number;
  tackling?: number;
  infield_kicking?: number;
  strength?: number;
  playmaking?: number;
  ball_carrying?: number;
};
