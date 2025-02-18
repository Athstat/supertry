import React, { useState } from "react";
import {
  Trophy,
  Users,
  Star,
  ChevronRight,
  Award,
  Newspaper,
  PlusCircle,
  Shield,
} from "lucide-react";
import { Header } from "./components/Header";
import { JoinLeagueCard } from "./components/JoinLeagueCard";
import { TeamCard } from "./components/TeamCard";
import { LeagueCard } from "./components/LeagueCard";
import { NewsCard } from "./components/NewsCard";
import { JoinLeagueScreen } from "./screens/JoinLeagueScreen";
import { TeamCreationScreen } from "./screens/TeamCreationScreen";
import { ReviewTeamScreen } from "./screens/ReviewTeamScreen";
import { LeagueScreen } from "./screens/LeagueScreen";
import { BottomNav } from "./components/BottomNav";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardScreen } from "./screens/DashboardScreen";
import { MyTeamsScreen } from "./screens/MyTeamsScreen";
import { MyTeamScreen } from "./screens/MyTeamScreen";
import { ProfileScreen } from "./screens/ProfileScreen";
import { RankingsScreen } from "./screens/RankingsScreen";
import { WelcomeScreen } from "./screens/auth/WelcomeScreen";
import { SignUpScreen } from "./screens/auth/SignUpScreen";
import { SignInScreen } from "./screens/auth/SignInScreen";
import { PlayersScreen } from "./screens/PlayersScreen";
import { PlayerProfileScreen } from "./screens/PlayerProfileScreen";

// Layout component to maintain consistent structure across routes
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-dark-850 pb-20">
    <Header />
    <div className="pt-1">{children}</div>
    <BottomNav />
  </div>
);

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/" element={<WelcomeScreen />} />
      <Route path="/signup" element={<SignUpScreen />} />
      <Route path="/signin" element={<SignInScreen />} />

      {/* Redirect dashboard to signin if not authenticated */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <DashboardScreen />
          </Layout>
        }
      />

      {/* Main dashboard route */}
      <Route
        path="/leagues"
        element={
          <Layout>
            <JoinLeagueScreen />
          </Layout>
        }
      />
      <Route
        path="/league/:leagueId"
        element={
          <Layout>
            <LeagueScreen />
          </Layout>
        }
      />

      {/* Team routes */}
      <Route
        path="/my-teams"
        element={
          <Layout>
            <MyTeamsScreen />
          </Layout>
        }
      />
      <Route
        path="/create-team"
        element={
          <Layout>
            <TeamCreationScreen />
          </Layout>
        }
      />
      <Route
        path="/review-team"
        element={
          <Layout>
            <ReviewTeamScreen />
          </Layout>
        }
      />
      <Route
        path="/my-team/:teamId"
        element={
          <Layout>
            <MyTeamScreen />
          </Layout>
        }
      />

      {/* Profile route */}
      <Route
        path="/profile/"
        element={
          <Layout>
            <ProfileScreen />
          </Layout>
        }
      />

      {/* Add Rankings route */}
      <Route
        path="/rankings"
        element={
          <Layout>
            <RankingsScreen />
          </Layout>
        }
      />

      {/* Players routes */}
      <Route
        path="/players"
        element={
          <Layout>
            <PlayersScreen />
          </Layout>
        }
      />
      <Route
        path="/players/:playerId"
        element={
          <Layout>
            <PlayerProfileScreen />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
