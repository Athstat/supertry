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
  highlights_link?: string
}

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
  player_number: number,
  is_captain?: boolean,
  is_substitute: boolean,
  game_id: string,
  team_id: string,
  athlete_id: string,
  position: string,
  source_id: string,
  tracking_id: string,
  player_name?: string,
  nick_name?: string,
  birth_country?: string,
  date_of_birth?: Date,
  isactive?: boolean,
  athstat_firstname?: string,
  athstat_lastname?: string,
  athstat_middleinitial?: string,
  general_comments?: string,
  age?: number,
  height?: number,
  weight?: number,
  hidden?: boolean,
  gender?: "M" | "F",
  price?: number,
  power_rank_rating?: number,
  position_class?: string,
  data_source?: string,
  image_url?: string,
  nationality?: string,
  birth_place?: string,
  form?: string,
  available?: boolean,
  team_image_url?: string,
  team_name?: string
}

export type ISeason = {
  id: string,
  name: string,
  start_date: Date,
  end_date: Date,
  games_supported: boolean,
  hidden?: boolean,
  data_source?: string,
  competition_id: string,
  source_id: number,
  web_supported: boolean
}

export type ITeam = {
  athstat_id: string,
  source_id: string,
  athstat_name: string,
  data_source: string,
  source_abbreviation?: string,
  athstat_abbreviation?: string,
  possible_names?: string,
  sport_id: string,
  organization_id: string,
  hidden: boolean,
  on_dark_image_url?: string | null,
  on_light_image_url?: string | null,
  image_url?: string
}

export type ITeamActionName = 'TurnoversConceded'| 'RucksWon'| 'ScrumsWonOutright'| 'Lineouts'| 'KicksFromHandMetres'| 'ScrumsLostFreeKick'| 'MaulsWonPenaltyTry'| 'PenaltyConcededDelibKnockOn'| 'Runs'| 'Kicks'| 'Points'| 'PenaltyConcededOffside'| 'LineoutsWonSteal'| 'ConversionsMissed'| 'ScrumsLostPenalty'| 'MaulsLostTurnover'| 'Passes'| 'TackleSuccess'| 'RestartsNotTen'| 'CarriesMadeGainLine'| 'TurnoversCarriedInTouch'| 'CarriesSupport'| 'TurnoversLostRuckOrMaul'| 'LineoutsLostHandlingError'| 'PenaltyConcededOwnHalf'| 'ScrumsWonPenaltyTry'| 'PenaltyConcededHighTackle'| 'BallsWonZoneA'| 'TacklesMissed'| 'MaulSuccess'| 'LineBreaks'| 'LineoutsThrowNotStraight'| 'PenaltyConcededStamping'| 'CarriesMetres'| 'CollectionKick'| 'PenaltyGoalsScored'| 'Restarts22M'| 'PenaltyConcededLineoutOffence'| 'SetPiecesWon'| 'RestartsSuccess'| 'KicksTryScored'| 'TrueRetainedKicks'| 'DefendersBeaten'| 'PenaltyConcededHandlingInRuck'| 'RestartsWon'| 'TurnoversKickError'| 'PenaltyConcededDissent'| 'PenaltyConcededKillingRuck'| 'Visits22'| 'KicksInTouch'| 'ScrumSuccess'| 'PenaltyConcededFoulPlay'| 'BallsWonZoneB'| 'LineoutsInfringed'| 'TurnoversOwnHalf'| 'KicksOppnCollection'| 'TurnoversWon'| 'RucksLost'| 'TerritorySecondHalf'| 'MaulMetres'| 'LineoutsCatchOpp'| 'MaulsLostOutright'| 'LineoutsLostOutright'| 'Carries'| 'PossessionFirstHalf'| 'FreeKickConcededGeneralPlay'| 'RestartsOppErrors'| 'TacklesMade'| 'RestartHalfway'| 'CollectionsFailed'| 'ScrumsReset'| 'ScrumsLostOutright'| 'MaulsWonPenalty'| 'PenaltouchesMissed'| 'Metres'| 'ScrumsWonFreeKick'| 'BallsWonZoneC'| 'ScrumsWonPushoverTry'| 'RestartsOutOfPlay'| 'LineoutsLostPenalty'| 'NumberOfTimesInPossession'| 'BallCarry'| 'KicksSucceded'| 'KicksOutOfPlay'| 'Tries'| 'Scrums'| 'AttackingEventsZoneC'| 'MaulsLost'| 'LineoutsLostFreeKick'| 'LineoutsLost'| 'CollectionsInterception'| 'BallsWonZoneD'| 'PenaltyConcededOther'| 'AttackingEventsZoneA'| 'LineoutSuccess'| 'Assists'| 'DropGoalsScored'| 'Territory'| 'PenaltouchesSucceded'| 'DropGoalsMissed'| 'RetainedKicks'| 'FreeKickConcededInRuckOrMaul'| 'LineoutsWonFreeKick'| 'RedCardSecondYellow'| 'PenaltyConcededObstruction'| 'PenaltyTries'| 'YellowCards'| 'PenaltiesConceded'| 'KicksOutTouchInGoal'| 'FreeKickConcededLineout'| 'RestartsLost'| 'LineoutsWon'| 'RestartsOwnPlayer'| 'TurnoversBadPass'| 'TryKicks'| 'LineoutsWonPenalty'| 'PenaltyConcededWrongSide'| 'AttackingEventsZoneB'| 'PenaltyConcededCollapsingMaul'| 'Offloads'| 'RedCards'| 'ConversionsScored'| 'MaulsWonTry'| 'GoalKicksScored'| 'TurnoversForwardPass'| 'ScrumsWonPenalty'| 'CollectionsLooseBall'| 'PenaltyConcededCollapsingOffense'| 'LineoutsWonTap'| 'CarriesNotMadeGainLine'| 'ScrumsWon'| 'TerritoryFirstHalf'| 'Mauls'| 'PossessionSecondHalf'| 'AttackingEventsZoneD'| 'MaulsWon'| 'Possession'| 'TurnoversCarriedOver'| 'ScrumsLostReversed'| 'Rucks'| 'PenaltyConcededScrumOffence'| 'PenaltyConcededOppHalf'| 'KicksFromHand'| 'CollectionsSucceded'| 'TurnoversOppHalf'| 'TerritoryLast10Mins'| 'TurnoversKnockOn'| 'PenaltyConcededEarlyTackle'| 'RuckSuccess'| 'MaulsWonOutright'| 'FreeKickConcededScrum'| 'PenaltyConcededCollapsing'| 'KicksChargedDown'| 'ScrumsLost'| 'LineoutsWonClean'| 'FreeKicksConceded';

export type ITeamAction = {
  team_id: string,
  game_id: string,
  action: ITeamActionName,
  action_count?: number
}