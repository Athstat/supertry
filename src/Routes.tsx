import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { SignUpScreen } from './screens/auth/SignUpScreen';
import { SignInScreen } from './screens/auth/SignInScreen';
import { AuthChoiceScreen } from './screens/auth/AuthChoiceScreen';
import { ForgotPasswordScreen } from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';
import OnBoardingScreen from './screens/OnboardingScreen';
import { CompleteProfileScreen } from './screens/CompleteProfileScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { FantasyLeaguesScreen } from './screens/FantasyLeaguesScreen';
import { FantasyLeagueScreen } from './screens/LeagueScreen';
import { MyTeamsListScreen } from './screens/MyTeamsScreen';
import { TeamCreationScreen } from './screens/TeamCreationScreen';
import { ReviewTeamScreen } from './screens/ReviewTeamScreen';
import { UserProfileScreen } from './screens/UserProfileScreen';
import { FantasyRankingsScreen } from './screens/FantasyRankingsScreen';
import { PlayersScreen } from './screens/players/PlayersScreen';
import { PlayerProfileScreen } from './screens/PlayerProfileScreen';
import JoinGroupScreen from './screens/JoinGroupScreen';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import SbrScreen from './screens/SbrScreen';
import FixtureScreen from './screens/FixtureScreen';
import FixturesScreen from './screens/FixturesScreen';
import SchoolsScreen from './screens/SchoolsScreen';
import InviteFriendsScreen from './screens/InviteFriendsScreen';
import SBRChatScreen from './components/sbr/SBRChatScreen';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import SbrFixtureScreen from './screens/SbrFixtureScreen';
import CompetitionsScreen from './screens/CompetitionsScreen';
import SeasonScreen from './screens/SeasonScreen';
import PredictionsRankingScreen from './screens/predictions/PredictionsRankingScreen';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { FirstVisitHandler } from './components/ui/FirstVisitHandler';
import VerifyEmailScreen from './screens/auth/VerifyEmailScreen';
import JoinLeagueOnboardingScreen from './screens/onboarding/JoinLeagueOnboardingScreen';
import InviteStepsScreen from './screens/onboarding/InviteStepsScreen';
import InAppMessagesScreen from './screens/notifications/InAppMessagesScreen';
import DashboardDataProvider from './components/dashboard/provider/DashboardDataProvider';
import EditAccountInfoScreen from './screens/myaccount/EditAccountInfoScreen';
import OnboardingDataProvider from './providers/OnboardingDataProvider';
import LeagueMemberTeamScreen from './screens/LeagueMemberTeamScreen';
import NotificationPreferencesScreen from './screens/myaccount/NotificationPreferencesScreen';
import NotFoundScreen from './screens/NotFoundScreen';
import PlayersOverviewScreen from './screens/players/PlayersOverviewScreen';
import PlayersByCountryScreen from './screens/players/PlayersByCountryScreen';
import PlayersByPositionClassScreen from './screens/players/PlayersByPositionClassScreen';

// Layout component to maintain consistent structure across routes
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-dark-850 pb-20">
    <Header />
    <div className="pt-1">{children}</div>
    <BottomNav />
  </div>
);

// Auth route component - redirects to dashboard if already authenticated
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { state } = useLocation();

  if (isAuthenticated) {
    const nextRoute = state?.fromPathname ?? '/dashboard';

    console.log('Next route: ', nextRoute);

    return <Navigate to={nextRoute} />;
  }

  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
};

const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<FirstVisitHandler />} />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SignUpScreen />
            </AuthRoute>
          }
        />
        <Route
          path="/signin"
          element={
            <AuthRoute>
              <SignInScreen />
            </AuthRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
        <Route path="/reset-password" element={<ResetPasswordScreen />} />
        <Route
          path="/auth-choice"
          element={
            <AuthRoute>
              <AuthChoiceScreen />
            </AuthRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardDataProvider>
                <Layout>
                  <DashboardScreen />
                </Layout>
              </DashboardDataProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/leagues"
          element={
            <ProtectedRoute>
              <Layout>
                <FantasyLeaguesScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/join-group/:inviteCode"
          element={
            <ProtectedRoute>
              <JoinGroupScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/league/:leagueId"
          element={
            <ProtectedRoute>
              <DashboardDataProvider>
                <Layout>
                  <FantasyLeagueScreen />
                </Layout>
              </DashboardDataProvider>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-teams"
          element={
            <ProtectedRoute>
              <Layout>
                <MyTeamsListScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/:officialLeagueId/create-team"
          element={
            <ProtectedRoute>
              <Layout>
                <TeamCreationScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/review-team"
          element={
            <ProtectedRoute>
              <Layout>
                <ReviewTeamScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <UserProfileScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players"
          element={
            <ProtectedRoute>
              <Layout>
                <PlayersOverviewScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players/country/:countryName"
          element={
            <ProtectedRoute>
              <Layout>
                <PlayersByCountryScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players/position_class/:positionClass"
          element={
            <ProtectedRoute>
              <Layout>
                <PlayersByPositionClassScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/players/:playerId"
          element={
            <ProtectedRoute>
              <Layout>
                <PlayerProfileScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sbr"
          element={
            <ProtectedRoute>
              <Layout>
                <SbrScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sbr/fixtures/:fixtureId"
          element={
            <ProtectedRoute>
              <Layout>
                <SbrFixtureScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sbr/chat"
          element={
            <ProtectedRoute>
              <Layout>
                <SBRChatScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fixtures/:fixtureId"
          element={
            <ProtectedRoute>
              <Layout>
                <FixtureScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fixtures"
          element={
            <ProtectedRoute>
              <Layout>
                <FixturesScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/schools"
          element={
            <ProtectedRoute>
              <Layout>
                <SchoolsScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Test, can be edited */}
        <Route
          path="/invite-friends"
          element={
            <ProtectedRoute>
              <Layout>
                <InviteFriendsScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Post-Sign-Up Welcome Screen */}
        <Route
          path="/post-signup-welcome"
          element={
            <ProtectedRoute>
              <OnboardingDataProvider>
                <OnBoardingScreen />
              </OnboardingDataProvider>
            </ProtectedRoute>
          }
        />

        {/* Complete Profile Screen */}
        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfileScreen />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/account-info"
          element={
            <ProtectedRoute>
              <Layout>
                <EditAccountInfoScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/notification-preferences"
          element={
            <ProtectedRoute>
              <Layout>
                <NotificationPreferencesScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/seasons"
          element={
            <ProtectedRoute>
              <Layout>
                <CompetitionsScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/seasons/:seasonId"
          element={
            <ProtectedRoute>
              <Layout>
                <SeasonScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/league/:leagueId/member/:userId"
          element={
            <ProtectedRoute>
              <Layout>
                <LeagueMemberTeamScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/predictions"
          element={
            <ProtectedRoute>
              <Layout>
                <PredictionsRankingScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/fantasy-rankings"
          element={
            <ProtectedRoute>
              <Layout>
                <FantasyRankingsScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="/verify-email" element={<VerifyEmailScreen />} />

        <Route path="/onboarding/join-league" element={<JoinLeagueOnboardingScreen />} />

        <Route path="/invite-steps" element={<InviteStepsScreen />} />

        <Route
          path="/in-app-messages"
          element={
            <ProtectedRoute>
              <Layout>
                <InAppMessagesScreen />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout>
                <NotFoundScreen />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
