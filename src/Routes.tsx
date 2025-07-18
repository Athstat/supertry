import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WelcomeScreen } from './screens/auth/WelcomeScreen';
import { SignUpScreen } from './screens/auth/SignUpScreen';
import { SignInScreen } from './screens/auth/SignInScreen';
import { AuthChoiceScreen } from './screens/auth/AuthChoiceScreen';
import { ForgotPasswordScreen } from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';
import PostSignUpWelcomeScreen from './screens/PostSignUpWelcomeScreen';
import { CompleteProfileScreen } from './screens/CompleteProfileScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { JoinLeagueScreen } from './screens/JoinLeagueScreen';
import { LeagueScreen } from './screens/LeagueScreen';
import { MyTeamsListScreen } from './screens/MyTeamsScreen';
import { TeamCreationScreen } from './screens/TeamCreationScreen';
import { ReviewTeamScreen } from './screens/ReviewTeamScreen';
import { MyTeamScreen } from './screens/MyTeamScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { FantasyRankingsScreen } from './screens/RankingsScreen';
import { PlayersScreen } from './screens/PlayersScreen';
import { PlayerProfileScreen } from './screens/PlayerProfileScreen';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import SbrScreen from './screens/SbrScreen';
import FixtureScreen from './screens/FixtureScreen';
import FixturesScreen from './screens/FixturesScreen';
import InviteFriendsScreen from './screens/InviteFriendsScreen';
import SBRChatScreen from './components/sbr/SBRChatScreen';
import RouteErrorBoundary from './components/RouteErrorBoundary';
import SbrFixtureScreen from './screens/SbrFixtureScreen';
import { isFirstAppVisit, markAppVisited } from './utils/firstVisitUtils';
import CompetitionsScreen from './screens/CompetitionsScreen';
import SeasonScreen from './screens/SeasonScreen';
import PredictionsRankingScreen from './screens/predictions/PredictionsRankingScreen';

// Layout component to maintain consistent structure across routes
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-dark-850 pb-20">
    <Header />
    <div className="pt-1">{children}</div>
    <BottomNav />
  </div>
);

// Protected route component with error boundary
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
};

// Auth route component - redirects to dashboard if already authenticated
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
};

// First Visit handler component
const FirstVisitHandler = () => {
  const { isAuthenticated, loading } = useAuth();
  const [hasVisitedBefore, setHasVisitedBefore] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has visited the app before
    const firstVisit = isFirstAppVisit();
    setHasVisitedBefore(!firstVisit);

    // If this is the first visit, mark it
    if (firstVisit) {
      markAppVisited();
    }
  }, []);

  if (loading || hasVisitedBefore === null) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  // First-time visitors see WelcomeScreen, returning visitors see AuthChoiceScreen
  return (
    <RouteErrorBoundary>
      {!hasVisitedBefore ? <WelcomeScreen /> : <AuthChoiceScreen />}
    </RouteErrorBoundary>
  );
};

const AppRoutes = () => {
  return (
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
      <Route
        path="/forgot-password"
        element={
          <AuthRoute>
            <ForgotPasswordScreen />
          </AuthRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <AuthRoute>
            <ResetPasswordScreen />
          </AuthRoute>
        }
      />
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
            <Layout>
              <DashboardScreen />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/leagues"
        element={
          <ProtectedRoute>
            <Layout>
              <JoinLeagueScreen />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/league/:leagueId"
        element={
          <ProtectedRoute>
            <Layout>
              <LeagueScreen />
            </Layout>
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
        path="/my-team/:teamId"
        element={
          <ProtectedRoute>
            <Layout>
              <MyTeamScreen />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Layout>
              <ProfileScreen />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/players"
        element={
          <ProtectedRoute>
            <Layout>
              <PlayersScreen />
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
            <PostSignUpWelcomeScreen />
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

    </Routes>


  );
};

export default AppRoutes;
