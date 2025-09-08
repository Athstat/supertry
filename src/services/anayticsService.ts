import * as amplitude from '@amplitude/analytics-browser';
import { authService } from './authService';
import { getDeviceInfo, getWeekFromLaunch, isInProduction } from '../utils/webUtils';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../types/fantasyLeague';

amplitude.init('7a73614db43ac3fb1e4c8b8e24a280eb', { autocapture: true });

function track(event: string, eventInfo?: Record<string, any>) {
    
    if (!isInProduction()) {
        console.log(`Skipped recording event ${event} because app is not in production`);
        return;
    }
    
    const { agent } = getDeviceInfo();
    const user = authService.getUserInfoSync();


    const res = amplitude.track(event, {
        ...eventInfo,
        timeStamp: new Date(),
        device: agent,
        source: getCurrentPath(),
        weekNumber: getWeekFromLaunch(),
        userId: user ? user.kc_id : null
    });

  console.log('Amplitude Res ', res);
}

function trackPageVisit(route: string) {
  const eventKey = `User_Page_Visit`;
  track(eventKey, {
    route: route,
  });
}

function trackUserSignUp(method: string, referrer?: string) {
  
  console.log("Tried to do a user signed up ", method);
  
  track('User_Signed_Up', {
    signUpMethod: method,
    referrer: referrer,
  });
}

function trackUserLogout() {
  track('User_Logged_Out');
}

function trackUserSignIn(method: string, referrer?: string) {

  console.log("Tracking user sign in ", method);

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

  console.log("Team Creation Started, we are creating team ", leagueRound);

  if (!leagueRound) return;

  track('Team_Started', {
    leagueId: leagueRound.id,
    officialLeagueId: leagueRound.official_league_id,
    leagueGroupId: leagueRound.fantasy_league_group_id
  });
}

function trackTeamCreationCompleted(leagueRound?: IFantasyLeagueRound, team?: IFantasyLeagueTeam) {

  if (!leagueRound || !team) return;

  track('Team_Created', {
    leagueId: leagueRound.id,
    officialLeagueId: leagueRound.official_league_id,
    teamId: team.id,
    team_name: team.team_name,
    team_athletes: team.athletes.map((a) => a.athlete_id)
  });
}

function trackFriendInvitesSent(method: string, teamId?: string) {
  track('Team_Invite_Sent', {
    friendCount: null,
    inviteMethod: method,
    teamId: teamId,
  });
}

function trackFriendInvitesReceived(method: string, userId?: string) {
  track('Team_Invite_Received', {
    inviterId: userId,
    inviteMethod: method,
  });
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
};
