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

  // UI display stats
  tries?: number;
  assists?: number;
  tackles?: number;
  penalties_conceded?: number;
  cards?: number;
}
