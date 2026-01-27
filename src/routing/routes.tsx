import { createBrowserRouter, Outlet } from "react-router-dom";
import { RootScreen } from "../screens/RootScreen";
import { SignUpScreen } from "../screens/auth/SignUpScreen";
import { SignInScreen } from "../screens/auth/SignInScreen";
import { ForgotPasswordScreen } from "../screens/auth/ForgotPasswordScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import { ProtectedRoute } from "../components/auth/layouts/ProtectedRoute";
import { DashboardScreen } from "../screens/DashboardScreen";
import { FantasyScreen } from "../screens/fantasy_leagues/FantasyScreen";
import { MyFantasyTeamScreen } from "../screens/fantasy_leagues/MyFantasyTeamScreen";
import SBRChatScreen from "../components/sbr/SBRChatScreen";
import OnboardingDataProvider from "../providers/OnboardingDataProvider";
import { CompleteProfileScreen } from "../screens/auth/CompleteProfileScreen";
import InviteFriendsScreen from "../screens/auth/InviteFriendsScreen";
import { UserProfileScreen } from "../screens/auth/UserProfileScreen";
import VerifyEmailScreen from "../screens/auth/VerifyEmailScreen";
import LeagueMemberTeamScreen from "../screens/fantasy_leagues/LeagueMemberTeamScreen";
import FantasyLeagueScreen from "../screens/fantasy_leagues/FantasyLeagueScreen";
import CompetitionsScreen from "../screens/fantasy_seasons/CompetitionsScreen";
import SeasonScreen from "../screens/fantasy_seasons/SeasonScreen";
import FixtureDetailScreen from "../screens/fixtures/FixtureDetailScreen";
import ProFixturesScreen from "../screens/fixtures/ProFixturesScreen";
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
import PlayersScreen from "../screens/players/PlayersScreen";
import ScoutingListScreen from "../screens/players/scouting/ScoutingListScreen";
import PredictionsRankingScreen from "../screens/predictions/PredictionsRankingScreen";
import SbrFixtureScreen from "../screens/sbr/SbrFixtureScreen";
import SbrScreen from "../screens/sbr/SbrScreen";
import SchoolsScreen from "../screens/sbr/SchoolsScreen";
import { AuthRoute, MainAppLayout } from "./layouts";
import RootProviders from "../RootProviders";
import TinyInviteStepsScreen from "../screens/onboarding/TinyInviteStepsScreen";
import ScoutingOnboardingScreen from "../screens/players/scouting/ScoutingOnboardingScreen";

/** App Data Router */
export const dataRouter = createBrowserRouter([
    {
        element: (
            <RootProviders>
                <Outlet />
            </RootProviders>
        ),

        children: [
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
                        <MainAppLayout>
                            <DashboardScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/leagues",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <FantasyScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/league/:leagueId",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <MyFantasyTeamScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/my-team",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <MyFantasyTeamScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/league/:leagueId/standings",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <FantasyLeagueScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <UserProfileScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/players",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <PlayersScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/players/all",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <AllPlayersScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/players/country/:countryName",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <PlayersByCountryScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/players/position-class/:positionClass",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <PlayersByPositionClassScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/players/teams/:teamId",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <PlayersByTeamScreens />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/scouting/my-list",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <ScoutingListScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/scouting/onboarding",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <ScoutingOnboardingScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/players/fantasy-top-performers",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <FantasyTopPerformersScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/sbr",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <SbrScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/sbr/fixtures/:fixtureId",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <SbrFixtureScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            // TODO: Remove route
            {
                path: "/sbr/chat",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <SBRChatScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/fixtures/:fixtureId",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <FixtureDetailScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/fixtures",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <ProFixturesScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/schools",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <SchoolsScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/invite-friends",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <InviteFriendsScreen />
                        </MainAppLayout>
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
                        <MainAppLayout>
                            <EditAccountInfoScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/profile/notification-preferences",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <NotificationPreferencesScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/seasons",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <CompetitionsScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/seasons/:seasonId",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <SeasonScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/league/:leagueId/member/:userId",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <LeagueMemberTeamScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/predictions",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <PredictionsRankingScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "/fantasy-rankings",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <FantasyRankingsScreen />
                        </MainAppLayout>
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
                path: "/i/:inviteId",
                element: (
                    <TinyInviteStepsScreen />
                )
            },

            {
                path: "/in-app-messages",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <InAppMessagesScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            },

            {
                path: "*",
                element: (
                    <ProtectedRoute>
                        <MainAppLayout>
                            <NotFoundScreen />
                        </MainAppLayout>
                    </ProtectedRoute>
                )
            }

        ]
    }
])