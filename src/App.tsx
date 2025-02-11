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
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Main dashboard route */}
      <Route
        path="/dashboard"
        element={
          <Layout>
            <DashboardScreen />
          </Layout>
        }
      />

      {/* League routes */}
      <Route
        path="/leagues"
        element={
          <Layout>
            <LeagueScreen />
          </Layout>
        }
      />
      <Route
        path="/join-league"
        element={
          <Layout>
            <JoinLeagueScreen />
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
    </Routes>
  );
}

export default App;
