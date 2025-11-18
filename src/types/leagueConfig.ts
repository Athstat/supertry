export interface IGamesLeagueConfig {
  league_id: string;
  league?: string;
  team_budget: number;
  lineup_size: number;
  bench_size: number;
  min_slot_index: number;
  max_slot_index: number;
  transfers_allowed: number;
  current_round: number;
  transfers_activated: boolean;
  starting_positions: string[];
  allowed_positions: string[];
}
