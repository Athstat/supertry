import { createBrowserRouter } from "react-router-dom";
import { RootScreen } from "../screens/RootScreen";
import { AuthRoute, Layout } from "../Routes";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import { ProtectedRoute } from "../components/auth/layouts/ProtectedRoute";
import { DashboardScreen } from "../screens/DashboardScreen";
import { FantasyScreen } from "../screens/fantasy_leagues/FantasyScreen";
import JoinGroupScreen from "../screens/fantasy_leagues/JoinGroupScreen";
import { MyFantasyTeamScreen } from "../screens/fantasy_leagues/MyFantasyTeamScreen";
import SBRChatScreen from "../components/sbr/SBRChatScreen";
import OnboardingDataProvider from "../providers/OnboardingDataProvider";
import { CompleteProfileScreen } from "../screens/auth/CompleteProfileScreen";
import InviteFriendsScreen from "../screens/auth/InviteFriendsScreen";
import { UserProfileScreen } from "../screens/auth/UserProfileScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import LeagueMemberTeamScreen from "../screens/fantasy_leagues/LeagueMemberTeamScreen";
import LeagueStandingsScreen from "../screens/fantasy_leagues/LeagueStandingsScreen";
import CompetitionsScreen from "../screens/fantasy_seasons/CompetitionsScreen";
import SeasonScreen from "../screens/fantasy_seasons/SeasonScreen";
import FixtureDetailScreen from "../screens/fixtures/FixtureDetailScreen";
import ProFixturesScreen from "../screens/fixtures/FixturesScreen";
import EditAccountInfoScreen from "../screens/myaccount/EditAccountInfoScreen";
import NotificationPreferencesScreen from "../screens/myaccount/NotificationPreferencesScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import InAppMessagesScreen from "../screens/notifications/InAppMessagesScreen";
import InviteStepsScreen from "../screens/onboarding/InviteStepsScreen";
import OnBoardingScreen from "../screens/onboarding/OnboardingScreen";
import AllPlayersScreen from "../screens/players/AllPlayersScreen";
import { FantasyRankingsScreen } from "../screens/players/FantasyRankingsScreen";
import FantasyTopPerformersScreen from "../screens/players/FantasyTopPerformersScreen";
import PlayersByCountryScreen from "../screens/players/PlayersByCountryScreen";
import PlayersByPositionClassScreen from "../screens/players/PlayersByPositionClassScreen";
import PlayersByTeamScreens from "../screens/players/PlayersByTeamScreens";
import PlayersOverviewScreen from "../screens/players/PlayersOverviewScreen";
import ScoutingListScreen from "../screens/players/scouting/ScoutingListScreen";
import PredictionsRankingScreen from "../screens/predictions/PredictionsRankingScreen";
import SbrFixtureScreen from "../screens/sbr/SbrFixtureScreen";
import SbrScreen from "../screens/sbr/SbrScreen";
import SchoolsScreen from "../screens/sbr/SchoolsScreen";

export const dataRouter = createBrowserRouter([
    { index: true, element: <RootScreen /> },
    {
        path: "/signup",
        element: (
            <AuthRoute>
                <SignUpScreen />
            </AuthRoute>
        )
    },

    {
        path: "/signin",
        element: (
            <AuthRoute>
                <SignInScreen />
            </AuthRoute>
        )
    },

    {
        path: "/forgot-password",
        element: <ForgotPasswordScreen />
    },

    {
        path: "/reset-password",
        element: <ResetPasswordScreen />
    },

    {
        path: "/dashboard",
        element: (
            <ProtectedRoute>
                <Layout>
                    <DashboardScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/leagues",
        element: (
            <ProtectedRoute>
                <Layout>
                    <FantasyScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/join-group/:inviteCode",
        element: (
            <ProtectedRoute>
                <JoinGroupScreen />
            </ProtectedRoute>
        )
    },

    {
        path: "/league/:leagueId",
        element: (
            <ProtectedRoute>
                <Layout>
                    <MyFantasyTeamScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/league/:leagueId/standings",
        element: (
            <ProtectedRoute>
                <Layout>
                    <LeagueStandingsScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Layout>
                    <UserProfileScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/players",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PlayersOverviewScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/players/all",
        element: (
            <ProtectedRoute>
                <Layout>
                    <AllPlayersScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/players/country/:countryName",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PlayersByCountryScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/players/position-class/:positionClass",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PlayersByPositionClassScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/players/teams/:teamId",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PlayersByTeamScreens />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/scouting/my-list",
        element: (
            <ProtectedRoute>
                <Layout>
                    <ScoutingListScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/players/fantasy-top-performers",
        element: (
            <ProtectedRoute>
                <Layout>
                    <FantasyTopPerformersScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/sbr",
        element: (
            <ProtectedRoute>
                <Layout>
                    <SbrScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/sbr/fixtures/:fixtureId",
        element: (
            <ProtectedRoute>
                <Layout>
                    <SbrFixtureScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    // TODO: Remove route
    {
        path: "/sbr/chat",
        element: (
            <ProtectedRoute>
                <Layout>
                    <SBRChatScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/fixtures/:fixtureId",
        element: (
            <ProtectedRoute>
                <Layout>
                    <FixtureDetailScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/fixtures",
        element: (
            <ProtectedRoute>
                <Layout>
                    <ProFixturesScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/schools",
        element: (
            <ProtectedRoute>
                <Layout>
                    <SchoolsScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/invite-friends",
        element: (
            <ProtectedRoute>
                <Layout>
                    <InviteFriendsScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/post-signup-welcome",
        element: (
            <ProtectedRoute>
                <OnboardingDataProvider>
                    <OnBoardingScreen />
                </OnboardingDataProvider>
            </ProtectedRoute>
        )
    },

    {
        path: "/complete-profile",
        element: (
            <ProtectedRoute>
                <CompleteProfileScreen />
            </ProtectedRoute>
        )
    },

    {
        path: "/profile/account-info",
        element: (
            <ProtectedRoute>
                <Layout>
                    <EditAccountInfoScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/profile/notification-preferences",
        element: (
            <ProtectedRoute>
                <Layout>
                    <NotificationPreferencesScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/seasons",
        element: (
            <ProtectedRoute>
                <Layout>
                    <CompetitionsScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/seasons/:seasonId",
        element: (
            <ProtectedRoute>
                <Layout>
                    <SeasonScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/league/:leagueId/member/:userId",
        element: (
            <ProtectedRoute>
                <Layout>
                    <LeagueMemberTeamScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/predictions",
        element: (
            <ProtectedRoute>
                <Layout>
                    <PredictionsRankingScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/fantasy-rankings",
        element: (
            <ProtectedRoute>
                <Layout>
                    <FantasyRankingsScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "/verify-email",
        element: (
            <VerifyEmailScreen />
        )
    },

    {
        path: "/onboarding/join-league",
        element: (
            <InviteStepsScreen />
        )
    },

    {
        path: "/invite-steps",
        element: (
            <InviteStepsScreen />
        )
    },

    {
        path: "/in-app-messages",
        element: (
            <ProtectedRoute>
                <Layout>
                    <InAppMessagesScreen />
                </Layout>
            </ProtectedRoute>
        )
    },

    {
        path: "*",
        element: (
            <ProtectedRoute>
                <Layout>
                    <NotFoundScreen />
                </Layout>
            </ProtectedRoute>
        )
    }

])