import React, { useState, useEffect } from 'react';
import { LeagueHeader } from '../components/league/LeagueHeader';
import { LeagueStandings } from '../components/league/LeagueStandings';
import { LeagueSettings } from '../components/league/LeagueSettings';
import { RankedFantasyTeam } from '../types/league';
import { fantasyTeamService } from '../services/fantasyTeamService';
import { TeamAthletesModal } from '../components/league/TeamAthletesModal';
import LeagueGroupChatFeed from '../components/leagues/LeagueGroupChat';
import { FantasyLeagueFixturesList } from '../components/league/FixturesList';
import { IFantasyLeague } from '../types/fantasyLeague';
import FantasyLeagueProvider from '../contexts/FantasyLeagueContext';
import { useFantasyLeague } from '../components/league/useFantasyLeague';
import { analytics } from '../services/anayticsService';
import { useNavigate, useLocation } from 'react-router-dom';
import { isLeagueLocked } from '../utils/leaguesUtils';
import { Lock } from 'lucide-react';
import TabView, { TabViewHeaderItem, TabViewPage } from '../components/shared/tabs/TabView';
import PageView from './PageView';
import { ErrorState } from '../components/ui/ErrorState';

export function LeagueScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTabKey = searchParams.get('tab') || 'standings';
  console.log('initialTabKey', initialTabKey);

  const [selectedTeam, setSelectedTeam] = useState<RankedFantasyTeam | null>(null);
  const [teamAthletes, setTeamAthletes] = useState<any[]>([]);
  const [loadingAthletes, setLoadingAthletes] = useState(false);

  const { leagueInfo, userTeam, error, isLoading, league, teams } = useFantasyLeague();

  useEffect(() => {
    setShowJumpButton(Boolean(userTeam?.rank && userTeam.rank > 5));
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

      navigate(`/${league.official_league_id}/create-team`, {
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

  return (
    <FantasyLeagueProvider>
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
                  teams={teams}
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
                <FantasyLeagueFixturesList userTeam={userTeam} league={league as IFantasyLeague} />
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
  );
}
