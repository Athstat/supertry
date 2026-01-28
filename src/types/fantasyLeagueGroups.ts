import { IProAthlete } from './athletes';
import { DjangoAuthUser } from './auth';
import { IFixture } from './fixtures';
import { IProSeason } from './season';

export type FantasyLeagueGroupType = 'user_created' | 'system_created' | 'official_league';

export type FantasyLeagueGroup = {
  id: string;
  title?: string;
  season_id?: string;
  creator_id?: string;
  is_private?: boolean;
  type?: FantasyLeagueGroupType;
  created_at?: Date;
  entry_code?: string;
  is_hidden?: boolean;
  description?: string;
  start_date?: Date;
  end_date?: Date;
  season: IProSeason;
  banner?: string,
  logo?: string
};

export type FantasyLeagueGroupMember = {
  user_id: string;
  fantasy_league_group_id: string;
  joined_at?: Date;
  is_admin?: boolean;
  user: DjangoAuthUser;
};

/** Represents the payload of the request to create
 * a fantasy league group
 */
export type NewFantasyLeagueGroupReq = {
  title: string;
  is_private: boolean;
  season_id: string;
  description?: string;
};

export type EditFantasyLeagueGroupReq = {
  title: string;
  is_private: boolean;
  description?: string;
};

/** Represents single league standing record */
export type FantasyLeagueGroupStanding = {
  user_id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  total_score?: number;
  rank: number;
};

export type MostSelectedRankingItem = IProAthlete & {
  times_selected: number;
  percentage_selected: number;
};

export type FantasyPointsScoredRankingItem = IProAthlete & {
  total_points: number;
};

/** type definition for a single player sport action ranking item */
export type PlayerSportActionRankingItem = IProAthlete & {
  action_count: number;
  action_name: string;
  season_id: string;
};

export type MemberRankingDetail = {
  user_id: string;
  fantasy_league_group_id: string;
  total_points: number;
  overall_rank: number;
  total_users: number;
  rank_percentile: number;
};

/** Represents a single league prediction ranking item */
export type LeaguePredictionRanking = {
  rank: number;
  user_id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  predictions_made: number;
  correct_predictions: number;
  accuracy: number;
  has_results: boolean;
};


export type IPlayerPercentageSelected = {
  times_selected: number,
  percentage_selected: number
}


export type PlayerPointsHistoryItem = {
  athlete_id: string,
  game_id: string,
  game: IFixture
  total_score: number
}

/** Type that represents a fantasy season ranking item */
export type FantasySeasonRankingItem = {
  user_id: string,
  first_name?: string,
  last_name?: string,
  username?: string,
  total_score: number,
  rank?: number,
  league_rank?: number,
  created_at: Date,
  updated_at?: Date,
  round_number?: number
}

export type FantasySeasonOverallRanking = FantasyPointsScoredRankingItem;

export type FantasySeasonWeeklyRanking = FantasySeasonRankingItem & {
  round_number: number
}