import React, { useState, useEffect } from 'react';
import { LeagueHeader } from '../components/league/LeagueHeader';
import { LeagueStandings } from '../components/league/LeagueStandings';
import { LeagueSettings } from '../components/league/LeagueSettings';
import { RankedFantasyTeam } from '../types/league';
import { fantasyTeamService } from '../services/fantasyTeamService';
import { TeamAthletesModal } from '../components/league/TeamAthletesModal';
import LeagueGroupChatFeed from '../components/fantasy-leagues/LeagueGroupChat';
import { FantasyLeagueFixturesList } from '../components/league/FixturesList';
import { IFantasyLeague } from '../types/fantasyLeague';
import FantasyLeagueProvider from '../contexts/FantasyLeagueContext';
import { useFantasyLeague } from '../components/league/useFantasyLeague';
import { analytics } from '../services/anayticsService';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLeagueLocked } from '../utils/leaguesUtils';
import { Lock, Share2, Copy } from 'lucide-react';
import TabView, { TabViewHeaderItem, TabViewPage } from '../components/shared/tabs/TabView';
import PageView from './PageView';
import { ErrorState } from '../components/ui/ErrorState';
import { ScopeProvider } from 'jotai-scope';
import { mutate } from 'swr';
import {
  fantasyLeagueAtom,
  fantasyLeagueLockedAtom,
  userFantasyTeamAtom,
} from '../state/fantasyLeague.atoms';

export function FantasyLeagueScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTabKey = searchParams.get('tab') || 'standings';
  const fromTeamCreation = (location.state as any)?.from === 'team-creation';

  const [selectedTeam, setSelectedTeam] = useState<RankedFantasyTeam | null>(null);
  const [teamAthletes, setTeamAthletes] = useState<any[]>([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);
  const [groupFilterMembers, setGroupFilterMembers] = useState<string[] | null>(null);

  const { leagueInfo, userTeam, error, isLoading, league, teams } = useFantasyLeague();

  useEffect(() => {
    setShowJumpButton(Boolean(userTeam?.rank && userTeam.rank > 5));
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Ensure freshest teams when arriving at LeagueScreen (e.g., after creating a team)
  useEffect(() => {
    if (league?.id) {
      // Revalidate SWR cache for participating teams
      mutate([league.id, 'participating-teams-hook']);
    }
    // We intentionally don't depend on teams to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [league?.id, location.state]);

  // Short-lived polling to overcome server-side lag after team creation
  useEffect(() => {
    if (!fromTeamCreation || !league?.id) return;
    if (userTeam) return; // already present

    let attempts = 0;
    const maxAttempts = 6; // ~9s if interval=1500ms
    const intervalMs = 1500;

    const timer = setInterval(() => {
      attempts += 1;
      mutate([league.id, 'participating-teams-hook']);
      if (attempts >= maxAttempts) {
        clearInterval(timer);
      }
    }, intervalMs);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromTeamCreation, league?.id, !!userTeam]);

  // Handle team click
  const handleTeamClick = async (team: RankedFantasyTeam) => {
    setSelectedTeam(team);
    setLoadingAthletes(true);

    try {
      // Fetch team athletes
      const athletes = await fantasyTeamService.fetchTeamAthletes(team.team_id);
      setTeamAthletes(athletes);
    } catch (error) {
      console.error('Failed to fetch team athletes:', error);
      // You can set an error state here if needed
    } finally {
      setLoadingAthletes(false);
    }
  };

  // Close team athletes modal
  const handleCloseModal = () => {
    setSelectedTeam(null);
    setTeamAthletes([]);
  };

  const handleJoinLeague = () => {
    if (league) {
      analytics.trackTeamCreationStarted(league.id, league.official_league_id);

      console.log('league to join: ', league);

      navigate(`/${league.season ? league.season : league.official_league_id}/create-team`, {
        state: { league },
      });
    }
  };

  // Function to view a team's details
  const viewTeam = (teamId: string) => {
    console.log('Viewing team:', teamId);
    // Navigate to team details page or open a modal
  };

  const isLocked = isLeagueLocked(league?.join_deadline);

  // Filter teams based on group selection
  const filteredTeams = groupFilterMembers
    ? teams.filter(team => groupFilterMembers.includes(team.userId))
    : teams;

  const handleGroupFilterChange = (groupMembers: string[] | null) => {
    setGroupFilterMembers(groupMembers);
  };

  const tabItems: TabViewHeaderItem[] = [
    {
      label: 'Standings',
      tabKey: 'standings',
    },

    {
      label: 'Chat',
      tabKey: 'chat',
    },

    {
      label: 'Fixtures',
      tabKey: 'fixtures',
    },

    {
      label: 'Info',
      tabKey: 'info',
    },

    // {
    //   label: 'Predictions',
    //   tabKey: 'predictions',
    // },
  ];

  const onJumpToTeam = () => {
    const userTeamRef = document.querySelector('[data-user-team="true"]');
    if (userTeamRef) {
      userTeamRef.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const atoms = [fantasyLeagueAtom, userFantasyTeamAtom, fantasyLeagueLockedAtom];

  return (
    <ScopeProvider atoms={atoms}>
      <FantasyLeagueProvider league={league}>
        <div className="min-h-screen bg-gray-50 dark:bg-black">
          <LeagueHeader
            leagueInfo={leagueInfo}
            onOpenSettings={() => setShowSettings(true)}
            isLoading={isLoading}
            league={league}
          >
            <div className="flex items-center gap-2">
              {!isLoading && userTeam === undefined && league && !isLocked && (
                <button
                  onClick={handleJoinLeague}
                  className="hidden lg:flex bg-white text-primary-700 font-semibold rounded-full px-4 py-2 shadow-md hover:bg-gray-100 transition"
                >
                  Join This League
                </button>
              )}

              {!isLoading && userTeam === undefined && isLocked && (
                <button
                  disabled
                  className="hidden cursor-not-allowed opacity-70 lg:flex bg-white text-primary-700 font-semibold rounded-full px-4 py-2 shadow-md hover:bg-gray-100 transition flex-row items-center justify-center gap-1"
                >
                  Join This League
                  <Lock className="w-3 h-3" />
                </button>
              )}
            </div>
          </LeagueHeader>

          <PageView className="p-4">
            {league && (
              <TabView
                tabHeaderItems={tabItems}
                tabKeySearchParam="tab"
                initialTabKey={initialTabKey}
              >
                <TabViewPage tabKey="standings">
                  <LeagueStandings
                    teams={filteredTeams}
                    showJumpButton={showJumpButton}
                    onJumpToTeam={onJumpToTeam}
                    isLoading={isLoading}
                    error={error}
                    onTeamClick={team => {
                      handleTeamClick(team);
                      viewTeam(team.team_id);
                    }}
                    league={league}
                  />
                </TabViewPage>

                <TabViewPage tabKey="chat">
                  <LeagueGroupChatFeed league={league} />
                </TabViewPage>

                <TabViewPage tabKey="fixtures">
                  <FantasyLeagueFixturesList
                    userTeam={userTeam}
                    league={league as IFantasyLeague}
                  />
                </TabViewPage>

                <TabViewPage tabKey="info">
                  <div className="bg-white dark:bg-dark-800/40 rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 dark:border-dark-600">
                      <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
                        <svg
                          className="w-6 h-6 text-primary-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        League Information
                      </h2>
                    </div>

                    <div className="p-4 space-y-6">
                      {/* League Admin/Creator */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          League Administrator
                        </h3>
                        {(() => {
                          const adminTeam = teams?.find(team => team.is_admin);
                          return adminTeam ? (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                  {adminTeam.first_name?.[0]}
                                  {adminTeam.last_name?.[0]}
                                </span>
                              </div>
                              <span className="text-gray-900 dark:text-white font-medium">
                                {adminTeam.first_name} {adminTeam.last_name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">Not available</span>
                          );
                        })()}
                      </div>

                      {/* Creation Date */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Created
                        </h3>
                        <span className="text-gray-900 dark:text-white">
                          {league?.created_date
                            ? new Date(league.created_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Not available'}
                        </span>
                      </div>

                      {/* Invite Code */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Invite Code
                        </h3>
                        {true ? (
                          <div className="flex items-center gap-3">
                            <code className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-md font-mono text-sm text-gray-900 dark:text-white">
                              {league.entry_code}
                            </code>
                            {/* Copy invite code */}
                            <button
                              onClick={() => {
                                const entryCode = league.entry_code ?? '';
                                navigator.clipboard
                                  .writeText(entryCode)
                                  .then(() => alert('Code copied to clipboard'))
                                  .catch(() => alert('Unable to copy code. Please try again.'));
                              }}
                              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                              aria-label="Copy invite code"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                            {/* Share full invite message */}
                            <button
                              onClick={async () => {
                                const baseUrl =
                                  (import.meta as any)?.env?.VITE_APP_LINK_BASE_URL ||
                                  window.location.origin;
                                const deepLink = `${baseUrl}/league/${league.id}`;
                                const entryCode = league.entry_code ?? '';
                                const shareMessage =
                                  `You’ve been invited to join a rugby league: “${league.title}”\n\n` +
                                  `🏉 Step 1: Install the app\n` +
                                  `👉 Download for iOS: https://apps.apple.com/za/app/scrummy-fantasy-rugby/id6744964910\n` +
                                  `👉 Download for Android: https://play.google.com/store/apps/details?id=com.scrummy&hl=en_ZA\n\n` +
                                  `📲 Step 2: Open the app, tap “Join a League”, and enter this code: ${entryCode}\n\n` +
                                  `Already have the app?\n` +
                                  `Just click here to join instantly: ${deepLink}`;

                                const shareData: ShareData = { title: shareMessage };

                                if (navigator.share) {
                                  try {
                                    await navigator.share(shareData);
                                  } catch (err) {
                                    console.error('Share failed:', err);
                                    // Fallback to clipboard on error
                                    navigator.clipboard
                                      .writeText(shareMessage)
                                      .then(() => alert('Invite copied to clipboard'))
                                      .catch(() =>
                                        alert('Unable to share or copy. Please try manually.')
                                      );
                                  }
                                } else {
                                  // Fallback for browsers that don't support navigator.share
                                  navigator.clipboard
                                    .writeText(shareMessage)
                                    .then(() => alert('Invite copied to clipboard'))
                                    .catch(() =>
                                      alert('Unable to copy invite. Please try manually.')
                                    );
                                }
                              }}
                              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium"
                              aria-label="Share invite"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">
                            Public league (no code required)
                          </span>
                        )}
                      </div>

                      {/* League Type */}
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          League Type
                        </h3>
                        <span className="text-gray-900 dark:text-white capitalize">
                          {league?.is_private ? 'Private' : 'Public'}
                        </span>
                      </div>

                      {/* Participants */}
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Participants
                        </h3>
                        <span className="text-gray-900 dark:text-white">
                          {league?.participants_count || teams?.length || 0} teams
                        </span>
                      </div>

                      {/* Duration */}
                      {(league?.start_round || league?.end_round) && (
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                            Duration
                          </h3>
                          <span className="text-gray-900 dark:text-white">
                            {league.start_round && league.end_round
                              ? `Round ${league.start_round} - ${league.end_round}`
                              : league.start_round
                                ? `From Round ${league.start_round}`
                                : league.end_round
                                  ? `Until Round ${league.end_round}`
                                  : 'Full season'}
                          </span>
                        </div>
                      )}

                      {/* Status */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                          Status
                        </h3>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              league?.is_open ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <span className="text-gray-900 dark:text-white">
                            {league?.is_open ? 'Open for joining' : 'Closed'}
                            {league?.has_ended && ' (Ended)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabViewPage>

                {/* <TabViewPage tabKey="predictions">
                <LeaguePredictionsTab />
              </TabViewPage> */}
              </TabView>
            )}

            {!league && <ErrorState error="Error Loading League Data" />}
          </PageView>
        </div>

        {showSettings && <LeagueSettings onClose={() => setShowSettings(false)} />}

        {/* Team Athletes Modal */}
        {selectedTeam && (
          <TeamAthletesModal
            team={selectedTeam as RankedFantasyTeam}
            athletes={teamAthletes}
            onClose={handleCloseModal}
            isLoading={loadingAthletes}
          />
        )}
        {/* Mobile CTA Button - Only for Join This League */}

        {!isLoading && userTeam === undefined && league && !isLocked && (
          <button
            onClick={handleJoinLeague}
            className="lg:hidden fixed bottom-20 inset-x-4 z-50 bg-gradient-to-br from-primary-700 to-primary-700 via-primary-800 hover:from-primary-800 hover:to-primary-900 hover:via-primary-900 text-white font-semibold rounded-xl py-3 shadow-lg"
          >
            Join This League
          </button>
        )}

        {!isLoading && userTeam === undefined && isLocked && (
          <button
            disabled
            className="lg:hidden cursor-not-allowed flex flex-row items-center justify-center gap-2 fixed bottom-20 inset-x-4 z-50 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 shadow-lg"
          >
            Join This League
            <Lock className="w-4 h-4" />
          </button>
        )}
      </FantasyLeagueProvider>
    </ScopeProvider>
  );
}
