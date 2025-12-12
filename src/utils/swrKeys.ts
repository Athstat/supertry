/** provides functions to get keys for different swr fetch keys */

import { authService } from '../services/authService';
import { IProSeason } from '../types/season';

export const swrFetchKeys = {
  getSbrUserMotmVoteKey: (fixtureId: string) => {
    return `user-sbr-fixture-motm-vote/${fixtureId}`;
  },

  getAllFixtureMotmVotesKey: (fixtureId: string) => {
    return `sbr-fixture-motm-votes/${fixtureId}`;
  },

  getSbrFixtureKey: (fixtureId: string) => {
    return `sbr-fixture/${fixtureId}`;
  },

  getProFixtureKey: (fixtureId: string) => {
    return `pro-fixture/${fixtureId}`;
  },

  getSbrFixtureTimeline: (fixtureId: string) => {
    return `sbr-fixture-events/${fixtureId}`;
  },

  getSbrFixtureBoxscoreKey: (fixtureId: string) => {
    return `sbr-fixture-boxscore/${fixtureId}`;
  },

  getUserProPredictionsHistoryKey: (userId: string) => {
    return `/user-pro-prediction-history/${userId}`;
  },

  getAuthUserProfileKey: () => {
    return '/auth-user-profile';
  },

  getAllProAthletesKey: () => {
    return 'pro-athletes';
  },

  getAthleteAggregatedStats: (athleteId: string, competitionId?: string) => {
    if (competitionId) {
      return `/athlete-aggregated-stats/${athleteId}/for-comp/${competitionId}`;
    }

    return `/athlete-aggregated-stats/${athleteId}`;
  },

  getAthleteSeasonStarRatings: (athleteId: string, seasonId: string) => {
    return `/athlete-season-star-ratings/${athleteId}/season/${seasonId}`;
  },

  getAthleteCareerStarRatings: (athleteId: string) => {
    return `/athlete-career-star-ratings/${athleteId}`;
  },

  getAllPublicFantasyLeagues: () => {
    return `public-fantasy-leagues`;
  },

  getAllDiscorverLeagues: () => {
    return `public-fantasy-leagues/discorver`;
  },

  getAllSuppportedSeasons: (seasonIds?: string[]) => {
    return `seasons/${seasonIds?.join('-')}`;
  },

  getAllSeasonAthletes: (season: IProSeason) => {
    return `seasons/${season.id}/athletes`;
  },

  getMyLeagueGroups: () => {
    const authUser = authService.getUserInfoSync();
    return `my-leagues/${authUser?.kc_id}`;
  },

  getLeagueGroupMembers: (leagueId: string) => {
    return `fantasy-league-group/members/${leagueId}`;
  },

  getJoinedFantasyLeagueGroups: () => {
    return `joined-league-groups`;
  },

  getFantasyLeagueGroupById: (id: string) => {
    return `fantasy-league-groups/${id}`;
  },

  getLeagueGroupRounds: (id: string) => {
    return `fantasy-league-groups/${id}/rounds`;
  },

  getGroupRoundGames: (leagueId: string, roundId: string) => {
    return `/fantasy-league-groups/${leagueId}/rounds/${roundId}/games`;
  },

  getLeaguesByEntryCode: (entry_code: string) => {
    return `/fantasy-league-groups/entry-code/${entry_code}`;
  },

  getAthleteSeasons: (id: string) => {
    return `/athletes/${id}/seasons`;
  },

  getAthleteSeasonStats: (id: string, season_id: string) => {
    return `/athletes/${id}/seasons/${season_id}/stats`;
  },

  getAthleteSeasonStars: (id: string, season_id: string) => {
    return `/athletes/${id}/seasons/${season_id}/stars`;
  },

  getAthleteTeamMates: (id: string) => {
    return `/athletes/${id}/team-mates`;
  },

  getAthleteMatchStats: (athleteId: string, gameId: string) => {
    return `/athletes/${athleteId}/matches/${gameId}/stats`;
  },

  getSportActionsDefinitions: () => {
    return '/sport-actions-definitions';
  },

  getAthleteById: (id: string) => {
    return `/athletes/${id}`;
  },

  getUserFantasyLeagueRoundTeam: (leagueId: string, roundId: string | number, userId?: string) => {
    userId = userId ? userId : authService.getUserInfoSync()?.kc_id;
    return `/fantasy-league-groups/${leagueId}/round/${roundId}/user/${userId}`;
  },

  getFantasyLeagueGroupStandings: (leagueGroupId: string) => {
    return `/fantasy-league-group/${leagueGroupId}/standings`;
  },

  getPlayerSquadReport: (teamId: string | number, trackingId: string) => {
    return `/fantasy-league-teams/${teamId}/athletes/${trackingId}/squad-report`;
  },

  getLeagueRoundScoringOverview: (leagueRoundId: string | number) => {
    return `/fantasy-league-rounds/${leagueRoundId}/scoring-overview`;
  },

  getActiveFantasySeasons: () => {
    return '/fantasy-seaons/active';
  },

  getSeasonRounds: (seasonId?: string) => {
    return `/fantasy-seaons/${seasonId}/rounds`;
  },

  getUserById: (userId: string) => {
    return `/users/${userId}`;
  },

  getNotificationProfileByUserId: (userId: string) => {
    return `/notifications/profiles/${userId}`;
  },

  getPastMatchups: (gameId: string) => {
    return `/games/${gameId}/past-matchups`;
  },

  getSeasonStandings: (seasonId: string) => {
    return `/seasons/$${seasonId}/standings`;
  },

  getFixturePotm: (fixtureId: string) => {
    return `/fixture/${fixtureId}/potm`;
  },

  getAthleteFixtureSportsActions: (fixtureId: string, athleteId: string) => {
    return `/fixtures/${fixtureId}/sports-actions/athletes/${athleteId}`;
  },

  getPlayerPointsHistory: (seasonId: string, athleteId: string) => {
    return `seasons/${seasonId}/athletes/${athleteId}/points-history`;
  },

  getScoutingListPlayer: (athleteId: string) => {
    return `/fantasy/scouting/my-list/check/${athleteId}`;
  },

  getFantasySeasonFeaturedGroup: (fantasySeasonId: string) => {
    return `/api/v1/fantasy-seasons/${fantasySeasonId}/fantasy-league-groups/featured`;
  }
};
