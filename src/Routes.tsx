import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { WelcomeScreen } from "./screens/auth/WelcomeScreen";
import { SignUpScreen } from "./screens/auth/SignUpScreen";
import { SignInScreen } from "./screens/auth/SignInScreen";
import PostSignUpWelcomeScreen from "./screens/PostSignUpWelcomeScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { JoinLeagueScreen } from "./screens/JoinLeagueScreen";
import { LeagueScreen } from "./screens/LeagueScreen";
import { MyTeamsListScreen } from "./screens/MyTeamsScreen";
import { TeamCreationScreen } from "./screens/TeamCreationScreen";
import { ReviewTeamScreen } from "./screens/ReviewTeamScreen";
import { MyTeamScreen } from "./screens/MyTeamScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { RankingsScreen } from "./screens/RankingsScreen";
import { PlayersScreen } from "./screens/PlayersScreen";
import { PlayerProfileScreen } from "./screens/PlayerProfileScreen";
import { useAuth } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { BottomNav } from "./components/BottomNav";
import SchoolBoyRugbyScreen from "./screens/SchoolBoyRugbyScreen";
import FixtureScreen from "./screens/FixtureScreen";
import FixtureListScreen from "./screens/FixtureListScreen";
import InviteFriendsScreen from "./screens/InviteFriendsScreen";
import SBRChatScreen from "./components/sbr/SBRChatScreen";
import { ScopeProvider } from "jotai-scope";
import { fixturesDateRangeAtom } from "./components/fixtures/calendar/fixtures_calendar.atoms";

// Layout component to maintain consistent structure across routes
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-dark-850 pb-20">
    <Header />
    <div className="pt-1">{children}</div>
    <BottomNav />
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/signin" />;
  }

  return <>{children}</>;
};

// Auth route component - redirects to dashboard if already authenticated
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth routes */}
      <Route
        path="/"
        element={
          <AuthRoute>
            <WelcomeScreen />
          </AuthRoute>
        }
      />
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
        path="/rankings"
        element={
          <ProtectedRoute>
            <Layout>
              <RankingsScreen />
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
              <SchoolBoyRugbyScreen />
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
              <ScopeProvider atoms={[fixturesDateRangeAtom]} >
                <FixtureListScreen />
              </ScopeProvider>
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
        path="/welcome"
        element={
          <ProtectedRoute>
            <PostSignUpWelcomeScreen />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
