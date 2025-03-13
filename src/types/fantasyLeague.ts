export interface IFantasyLeague {
  id: string;
  type: string;
  official_league_id: string;
  title: string;
  created_date: Date;
  entry_code: string | null;
  entry_fee: number | null;
  is_private: boolean;
  reward_type: string | null;
  reward_description: string | null;
  end_round: number | null;
  is_open: boolean;
  join_deadline: Date | null;
  disclaimer: string | null;
  has_ended: boolean;
  duration_type: string;
}
