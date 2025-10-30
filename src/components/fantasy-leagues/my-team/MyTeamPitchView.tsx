import { useEffect, useState } from 'react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { TeamFormation } from '../../team/TeamFormation';
import { PlayerActionModal } from '../../team/PlayerActionModal';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import PointsBreakdownModal from '../../fantasy-league/team-modal/points_breakdown/PointsBreakdownModal';
import { useFantasyLeagueTeam } from './FantasyLeagueTeamProvider';
import WarningCard from '../../shared/WarningCard';
import { useMyTeamView } from './MyTeamStateProvider';
import { fantasyAnalytics } from '../../../services/analytics/fantasyAnalytics';
import { useHideBottomNavBar } from '../../../hooks/navigation/useNavigationBars';
import TeamBenchDrawer from './TeamBenchDrawer';

type Props = {
  leagueRound: IFantasyLeagueRound;
  team: IFantasyLeagueTeam;
};

/** Renders my team pitch view */
export default function MyTeamPitchView({ leagueRound, team }: Props) {

  useHideBottomNavBar();

  const { slots, isTeamFull, selectedCount } = useFantasyLeagueTeam();
  const [selectedPlayer, setSelectedPlayer] = useState<IFantasyTeamAthlete>();

  const [showActionModal, setShowActionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);

  const { navigate: navigateViewMode } = useMyTeamView();


  useEffect(() => {
    fantasyAnalytics.trackVisitedTeamPitchView();
  }, []);

  const handlePlayerClick = (player: IFantasyTeamAthlete) => {
    setSelectedPlayer(player);
    setShowActionModal(true);
  };

  const handleCloseActionModal = () => {
    setShowActionModal(false);
    setSelectedPlayer(undefined);
  };

  const handleViewProfile = () => {
    setShowActionModal(false);
    setShowPointsModal(false);

    setShowProfileModal(true);
  };

  const handleViewPointsBreakdown = () => {
    setShowActionModal(false);
    setShowProfileModal(false);

    setShowPointsModal(true);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setShowActionModal(true);
  };

  const handleClosePointsModal = () => {
    setShowPointsModal(false);
    setShowActionModal(true);
  };

  const starters = slots
    .filter((p) => p.slotNumber !== 6)
    .map(p => ({ ...p!, is_starting: p!.slotNumber !== 6 }));

  const superSubSlot = slots
    .find(player => player.slotNumber === 6);

  const emptySlotCount = 6 - selectedCount;

  const handleGoToEdit = () => {
    navigateViewMode("edit");
  }

  return (
    <div className="mt-4 ">
      <div className='flex flex-col relative'>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Team Formation</h2>

        <div className='mb-4 flex flex-col gap-0' >
          <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide font-medium">
            Greyed out players are not playing in this round's games
          </p>

          {!isTeamFull && (
            <WarningCard className='text-sm' >
              <p>
                You have empty slot{emptySlotCount <= 1 ? '' : 's'} on your team. Click on <span className='underline cursor-pointer text-blue-500 hover:text-blue-600' onClick={handleGoToEdit} >Edit</span> to add {selectedCount <= 1 ? "a player to that slot" : "players to those empty slots"}
              </p>
            </WarningCard>
          )}
        </div>

        {leagueRound && starters.length > 0 && (
          <TeamFormation players={starters} onPlayerClick={handlePlayerClick} round={leagueRound} />
        )}

        {/* Super Substitute */}
        {leagueRound && superSubSlot && (
          <TeamBenchDrawer
            superSubSlot={superSubSlot}
            leagueRound={leagueRound}
          />
        )}
        
      </div>



      {selectedPlayer && showActionModal && (
        <PlayerActionModal
          player={selectedPlayer}
          onViewPointsBreakdown={handleViewPointsBreakdown}
          onClose={handleCloseActionModal}
          onViewProfile={handleViewProfile}
        />
      )}

      {selectedPlayer && showProfileModal && (
        <PlayerProfileModal
          player={selectedPlayer}
          isOpen={showProfileModal}
          onClose={handleCloseProfileModal}
        />
      )}

      {selectedPlayer && showPointsModal && (
        <PointsBreakdownModal
          isOpen={showPointsModal}
          athlete={selectedPlayer}
          team={team}
          round={leagueRound}
          onClose={handleClosePointsModal}
        />
      )}
    </div>
  );
}
