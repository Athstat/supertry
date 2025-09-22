import * as amplitude from '@amplitude/analytics-browser';
import { authService } from '../authService';
import { getDeviceInfo, getWeekFromLaunch, isInProduction } from '../../utils/webUtils';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';
import { IProAthlete } from '../../types/athletes';
import { IFixture } from '../../types/games';

amplitude.init('7a73614db43ac3fb1e4c8b8e24a280eb', {
  defaultTracking: true,
});

function track(event: string, eventInfo?: Record<string, any>) {
  if (!isInProduction()) {
    console.log(`Skipped recording event ${event} because app is not in production`);
    return;
  }

  const { agent } = getDeviceInfo();
  const user = authService.getUserInfoSync();

  const reqBody = {
    ...eventInfo,
    timeStamp: new Date(),
    device: agent,
    source: getCurrentPath(),
    weekNumber: getWeekFromLaunch(),
    userId: user ? user.kc_id : null,
  };

  console.log('Logging Event ', reqBody);

  const res = amplitude.track(event, reqBody);

  console.log('Amplitude Res ', res);
}

function trackPageVisit(route: string) {
  const eventKey = `User_Page_Visit`;
  track(eventKey, {
    route: route,
  });
}

function trackUserSignUp(method: string, referrer?: string) {
  console.log('Tried to do a user signed up ', method);

  track('User_Signed_Up', {
    signUpMethod: method,
    referrer: referrer,
  });
}

function trackUserLogout() {
  track('User_Logged_Out');
}

function trackUserSignIn(method: string, referrer?: string) {
  console.log('Tracking user sign in ', method);

  track('User_Signed_In', {
    referrer: referrer,
    method: method,
  });
}

export function getCurrentPath() {
  if (typeof window !== 'undefined') {
    return window.location.pathname;
  }
  return null;
}

function trackTeamCreationStarted(leagueRound?: IFantasyLeagueRound) {
  console.log('Team Creation Started, we are creating team ', leagueRound);

  if (!leagueRound) return;

  track('Team_Started', {
    leagueId: leagueRound.id,
    officialLeagueId: leagueRound.official_league_id,
    leagueGroupId: leagueRound.fantasy_league_group_id,
  });
}

function trackTeamCreationCompleted(leagueRound?: IFantasyLeagueRound, team?: IFantasyLeagueTeam) {
  if (!leagueRound || !team) return;

  track('Team_Created', {
    leagueId: leagueRound.id,
    officialLeagueId: leagueRound.official_league_id,
    teamId: team.id,
    team_name: team.team_name,
    team_athletes: team.athletes.map(a => a.athlete_id),
  });
}

function trackFriendInvitesSent(method: string, leagueGroup: FantasyLeagueGroup) {
  track('League_Invite_Sent', {
    friendCount: null,
    inviteMethod: method,
    leagueGroupId: leagueGroup.id,
    leagueGroupName: leagueGroup.title,
  });
}

function trackFriendInvitesReceived(method: string, userId?: string) {
  track('Team_Invite_Received', {
    inviterId: userId,
    inviteMethod: method,
  });
}

function trackOnboardingSkipped() {
  track('Onboarding_Skipped');
}

function trackOnboardingCtaContinued(nextUrl: string) {
  track('Onboarding_CTA_Continued', {
    nextUrl,
  });
}

function trackComparedPlayers(players: IProAthlete[]) {
  track('Compared_Players', {
    playerIds: players.map(p => p.tracking_id),
  });
}

function trackOpenedPlayerProfile(playerId: string, source?: string) {
  track('Opened_Player_Profile', {
    playerId: playerId,
    source: source,
  });
}

function trackClosedPlayerProfile(playerId: string, startTime: Date, endTime: Date) {
  const duration =
    startTime && endTime ? new Date(endTime).valueOf() - new Date(startTime).valueOf() : 0;
  const durationSeconds = duration / 1000;

  console.log(`User spent ${durationSeconds}s on the player profile modal`);

  track('Closed_Player_Profile', {
    playerId: playerId,
    durationSeconds: durationSeconds,
  });
}

function trackChangedNotificationPreference(old: string, new_preff: string) {
  console.log('User changed preference from', old, 'to', new_preff);

  track('Changed_Notification_Preference', {
    previous_preference: old,
    new_preference: new_preff,
  });
}

function trackFixtureCardClicked(fixture: IFixture) {
  const dateNow = new Date();

  track('Fixture_Card_Clicked', {
    game_id: fixture.game_id,
    title:
      fixture.team && fixture.opposition_team
        ? `${fixture.team.athstat_name} vs ${fixture.opposition_team.athstat_name}`
        : undefined,
    game_status: fixture.game_status,
    EpochFromKickoff: fixture.kickoff_time
      ? new Date(fixture.kickoff_time).valueOf() - dateNow.valueOf()
      : undefined,
  });
}

/** Tracks the first visit of a user to the app */
function trackFirstUserVisit() {
  track('First_User_Visit');
}

export const analytics = {
  track,
  trackPageVisit,
  trackUserSignUp,
  trackUserSignIn,
  trackUserLogout,
  trackTeamCreationStarted,
  trackTeamCreationCompleted,
  trackFriendInvitesSent,
  trackFriendInvitesReceived,
  trackOnboardingSkipped,
  trackOnboardingCtaContinued,
  trackComparedPlayers,
  trackOpenedPlayerProfile,
  trackFixtureCardClicked,
  trackChangedNotificationPreference,
  trackClosedPlayerProfile,
  trackFirstUserVisit,
};
