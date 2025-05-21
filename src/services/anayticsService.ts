import * as amplitude from '@amplitude/analytics-browser';
import { authService } from './authService';
import { getDeviceInfo, getWeekFromLaunch, isInProduction } from '../utils/webUtils';

// Initialize Amplitude with error handling
try {
  amplitude.init('7a73614db43ac3fb1e4c8b8e24a280eb', { 
    "autocapture": true,
    // Add error handling for Amplitude
    "logLevel": isInProduction() ? 0 : 2 // 0: DISABLE, 2: INFO
  });
} catch (error) {
  console.error("Failed to initialize analytics:", error);
}

function track(event: string, eventInfo?: Record<string, any>) {
  try {
    if (!isInProduction()) {
      console.log(`Skipped recording event ${event} because app is not in production`);
      return;
    }
    
    // Get device info with error handling
    let agent;
    try {
      const deviceInfo = getDeviceInfo();
      agent = deviceInfo.agent;
    } catch (deviceError) {
      console.error("Failed to get device info:", deviceError);
      agent = "unknown";
    }
    
    // Get user info with error handling
    let userId = null;
    try {
      const user = authService.getUserInfo();
      userId = user ? user.id : null;
    } catch (userError) {
      console.error("Failed to get user info:", userError);
    }

    // Track event with error handling
    amplitude.track(event, {
      ...eventInfo,
      timeStamp: new Date(),
      device: agent,
      source: getCurrentPath(),
      weekNumber: getWeekFromLaunch(),
      userId: userId
    });
  } catch (error) {
    console.error(`Failed to track event ${event}:`, error);
    // Prevent the error from bubbling up and potentially causing UI issues
  }
}

function trackPageVisit(route: string) {
  try {
    const eventKey = `User_Page_Visit`;
    track(eventKey, {
      route: route
    });
  } catch (error) {
    console.error("Failed to track page visit:", error);
    // Prevent the error from bubbling up
  }
}

function trackUserSignUp(method: string, referrer?: string) {
  try {
    track("User_Signed_Up", {
      signUpMethod: method,
      referrer: referrer
    });
  } catch (error) {
    console.error("Failed to track user sign up:", error);
  }
}

function trackUserLogout() {
  try {
    track("User_Logged_Out");
  } catch (error) {
    console.error("Failed to track user logout:", error);
  }
}

function trackUserSignIn(method: string, referrer?: string) {
  try {
    track("User_Signed_In", {
      referrer: referrer,
      method: method
    });
  } catch (error) {
    console.error("Failed to track user sign in:", error);
  }
}

export function getCurrentPath() {
  try {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
  } catch (error) {
    console.error("Failed to get current path:", error);
  }
  return null;
}

function trackTeamCreationStarted(leagueId: string, officialLeagueId: string) {
  try {
    track("Team_Started", {
      leagueId: leagueId,
      officialLeagueId: officialLeagueId
    });
  } catch (error) {
    console.error("Failed to track team creation started:", error);
  }
}

function trackTeamCreationCompleted(leagueId: string, teamId: string, officialLeagueId: string) {
  try {
    track("Team_Created", {
      leagueId: leagueId,
      officialLeagueId: officialLeagueId,
      teamId: teamId
    });
  } catch (error) {
    console.error("Failed to track team creation completed:", error);
  }
}

function trackFriendInvitesSent(method: string, teamId?: string) {
  try {
    track("Team_Invite_Sent", {
      friendCount: null,
      inviteMethod: method,
      teamId: teamId
    });
  } catch (error) {
    console.error("Failed to track friend invites sent:", error);
  }
}

function trackFriendInvitesReceived(method: string, userId?: string) {
  try {
    track("Team_Invite_Received", {
      inviterId: userId,
      inviteMethod: method
    });
  } catch (error) {
    console.error("Failed to track friend invites received:", error);
  }
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
    trackFriendInvitesReceived

}
