export interface ICreateFantasyLeague {
  title: string;
  description?: string;
  is_public: boolean;
  max_teams?: number;
  entry_fee?: number;
  prize_pool?: number;
  rules?: string;
  join_deadline?: string;
  season_id: string; // required
}

export interface IUserCreatedLeague {
  entry_code: string | number;
  id: string;
  title: string;
  description?: string;
  creator: {
    kc_id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  is_public: boolean;
  participant_count: number;
  is_joined: boolean;
  status: 'open' | 'locked' | 'ended';
  created_date: string;
  max_teams: number;
  entry_fee: number;
  prize_pool: number;
  join_deadline?: string;
  season_id: string;
  season_name?: string;
  official_league_id: string;
}
