import { useEffect, useState } from 'react';
import CreateMyTeam from './CreateMyTeam';
import ViewMyTeam from './ViewMyTeam';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { leagueService } from '../../services/leagueService';
import { IGamesLeagueConfig } from '../../types/leagueConfig';
import PlayerProfileModal from '../player/PlayerProfileModal';
import FantasyRoundsList from './FantasyRoundsList';
import { Gender } from '../../types/athletes';
import { useQueryState } from '../../hooks/useQueryState';

export default function MyTeams() {
  const [tabScene, setTabScene] = useState<'fantasy-rounds' | 'creating-team' | 'team-created'>(
    'fantasy-rounds'
  );
  const { refreshRounds, sortedRounds, currentRound } = useFantasyLeagueGroup();
  const [selectedRound, setSelectedRound] = useState<IFantasyLeagueRound | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<IFantasyLeagueTeam | null>(null);
  const [isFetchingTeams, setIsFetchingTeams] = useState<boolean>(false);
  const [roundIdToTeams, setRoundIdToTeams] = useState<Record<string, IFantasyLeagueTeam[]>>({});
  const [showCreationSuccessModal, setShowCreationSuccessModal] = useState<boolean>(false);
  const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig>();
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key to force re-fetch
  const [selectedPlayer, setSelectedPlayer] = useState<IFantasyTeamAthlete | null>(null);

  const [journey, setJourney] = useQueryState('journey');

  useEffect(() => {

    if (journey === 'team-creation' && currentRound) {
      console.log("Current Tab ", currentRound);
      setSelectedRound(currentRound);
      setTabScene('creating-team');
    }

  }, [journey, currentRound, setTabScene]);

  // Handler for player click in FantasyRoundCard
  const handlePlayerClick = (player: IFantasyTeamAthlete) => {
    console.log('handlePlayerClick called with player:', player);
    setSelectedPlayer(player);
  };

  // Handler for creating a new team
  const handleCreateTeam = (round: IFantasyLeagueRound) => {
    setSelectedRound(round);
    setTabScene('creating-team');
  };

  // Handler for viewing an existing team
  const handleViewTeam = (team: IFantasyLeagueTeam, round: IFantasyLeagueRound) => {
    console.log('handleViewTeam called with team:', team);
    setSelectedTeam(team);
    setSelectedRound(round);
    setTabScene('team-created');
  };

  // Fetch teams for the current round
  const fetchTeamsForCurrentRound = async (roundId: string) => {
    if (!roundId) return;

    try {
      setIsFetchingTeams(true);
      const teams = await leagueService.fetchParticipatingTeams(roundId);

      setRoundIdToTeams(prev => ({
        ...prev,
        [roundId]: teams ?? [],
      }));

      // Update the selected team if it exists in the new data
      if (selectedTeam) {
        const updatedTeam = teams?.find(t => t.id === selectedTeam.id);
        if (updatedTeam) {
          console.log('updatedTeam: ', updatedTeam);
          setSelectedTeam(updatedTeam);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teams for round', error);
    } finally {
      setIsFetchingTeams(false);
    }
  };

  useEffect(() => {
    const fetchLeagueConfig = async () => {
      if (!selectedRound?.season_id) return;
      try {
        const config = await leagueService.getLeagueConfig(selectedRound.season_id.toString());
        if (!config) {
          throw new Error('Failed to load league configuration');
        }
        setLeagueConfig(config);
      } catch (error) {
        console.error('Failed to fetch league config:', error);
      }
    };

    fetchLeagueConfig();
  }, [selectedRound?.season_id]);

  // Render the main content based on the current tab scene
  const renderContent = () => {
    if (tabScene === 'fantasy-rounds') {
      return (
        <FantasyRoundsList
          rounds={currentRound ? [currentRound] : []}
          handleCreateTeam={handleCreateTeam}
          handlePlayerClick={handlePlayerClick}
          handleViewTeam={handleViewTeam}
          refreshRounds={refreshRounds}
        />
      );
    }

    if (tabScene === 'creating-team') {
      return (
        <CreateMyTeam
          leagueRound={selectedRound ?? undefined}
          onBack={() => setTabScene('fantasy-rounds')}
          leagueConfig={leagueConfig}
          onViewTeam={() => setTabScene('team-created')}
          onTeamCreated={(team: IFantasyLeagueTeam) => {
            // Optimistically update the teams for the current round

            setJourney("")

            if (selectedRound) {
              setRoundIdToTeams(prev => ({
                ...prev,
                [selectedRound.id]: [...(prev[selectedRound.id] || []), team],
              }));
              setSelectedRound(selectedRound);
            }

            // Set the selected team and trigger a background refresh
            setSelectedTeam(team);
            setRefreshKey(prev => prev + 1);
          }}
        />
      );
    }

    if (tabScene === 'team-created' && selectedRound && selectedTeam) {
      return (
        <ViewMyTeam
          leagueRound={selectedRound}
          leagueConfig={leagueConfig}
          team={selectedTeam}
          onBack={() => setTabScene('fantasy-rounds')}
          onTeamUpdated={async () => {
            if (selectedRound?.id) {
              return fetchTeamsForCurrentRound(selectedRound.id);
            }
            return Promise.resolve();
          }}
        />
      );
    }

    return <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading...</div>;
  };

  return (
    <>
      {renderContent()}

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <PlayerProfileModal
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          player={{
            ...selectedPlayer,
            tracking_id: selectedPlayer.athlete_id,
            athstat_firstname: selectedPlayer.player_name,
            gender: selectedPlayer.gender as Gender,
            hidden: false,
            position: selectedPlayer.position,
            team_id: selectedPlayer.athlete_team_id ?? '',
            team: {
              athstat_name: selectedPlayer.team_name || '',
              athstat_id: selectedPlayer.athlete_team_id ?? '',
              image_url: selectedPlayer.team_logo,
              source_id: '',
              organization: '1',
              sport: '1'
            },
            image_url: selectedPlayer.image_url,
            power_rank_rating: selectedPlayer.power_rank_rating,
          }}
        />
      )}
    </>
  );
}
