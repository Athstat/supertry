import { useEffect, useState } from 'react';
import TeamBenchDrawer from './TeamBenchDrawer';
import { AnimatePresence } from 'framer-motion';
import { useFantasyTeam } from '../../hooks/fantasy/useFantasyTeam';
import { fantasyAnalytics } from '../../services/analytics/fantasyAnalytics';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import PlayerProfileModal from '../player/PlayerProfileModal';
import PointsBreakdownModal from '../points_breakdown/PointsBreakdownModal';
import { FantasyTeamFormation3D } from './FantasyTeamFormation3D';
import { PlayerActionModal } from './PlayerActionModal';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string,
  hideBenchPlayer?: boolean,
  firstRowCN?: string,
  pitchCN?: string
}

/** Renders my team pitch view */
export default function MyTeamPitchView({ className, hideBenchPlayer = false, firstRowCN, pitchCN }: Props) {


  const { slots, team, leagueRound } = useFantasyTeam();
  const [selectedPlayer, setSelectedPlayer] = useState<IFantasyTeamAthlete>();

  const [showActionModal, setShowActionModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);


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


  return (
    <div className={twMerge(
      " h-full",
      className
    )}>
      <div className='flex flex-col relative'>


        {leagueRound && starters.length > 0 && (
          <FantasyTeamFormation3D
            marginCN={twMerge(
              'mt-0',
              pitchCN
            )}
            firstRowMargin={twMerge(
              '',
              firstRowCN
            )}
            onPlayerClick={handlePlayerClick}
          />
        )}

        {/* Super Substitute */}
        {leagueRound && superSubSlot && !hideBenchPlayer && (
          <TeamBenchDrawer
            onPlayerClick={handlePlayerClick}
          />
        )}

      </div>

      {selectedPlayer && showActionModal && (
        <AnimatePresence>
          <PlayerActionModal
            player={selectedPlayer}
            onViewPointsBreakdown={handleViewPointsBreakdown}
            onClose={handleCloseActionModal}
            onViewProfile={handleViewProfile}
          />
        </AnimatePresence>
      )}

      {selectedPlayer && showProfileModal && (
        <PlayerProfileModal
          player={selectedPlayer}
          isOpen={showProfileModal}
          onClose={handleCloseProfileModal}
        />
      )}

      {selectedPlayer?.athlete && showPointsModal && team && (
        <PointsBreakdownModal
          isOpen={showPointsModal}
          athlete={selectedPlayer.athlete}
          team={team}
          onClose={handleClosePointsModal}
        />
      )}
    </div>
  );
}
