import PlayerProfileBanner from './profile-modal-components/PlayerProfileBanner';
import PlayerNameAndPosition from './profile-modal-components/PlayerNameAndPosition';
import PlayerProfileModalTabContent from './profile-modal-components/PlayerProfileModalTabContent';
import PlayerDataProvider from './provider/PlayerDataProvider';
import DialogModal from '../shared/DialogModal';
import { IProAthlete } from '../../types/athletes';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { useCallback, useEffect, useState } from 'react';
import { analytics } from '../../services/analytics/anayticsService';

interface Props {
  player: IProAthlete | IFantasyTeamAthlete;
  isOpen: boolean;
  onClose: () => void;
  roundId?: string;
  source?: string;
}

export default function PlayerProfileModal({ player, isOpen, onClose, source }: Props) {
  /** Holds the time stamp where the modal as opened, for analytics purposes */
  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    if (player && isOpen) {
      setStartTime(new Date());
      analytics.trackOpenedPlayerProfile(player.tracking_id, source);
    }
  }, [player, isOpen, source]);

  const handleCloseModal = useCallback(() => {
    analytics.trackClosedPlayerProfile(player.tracking_id, startTime, new Date());

    if (onClose) {
      onClose();
    }

  }, [onClose, player.tracking_id, startTime]);

  return (
    <PlayerDataProvider onClose={handleCloseModal} player={player}>
      <DialogModal
        open={isOpen}
        className="p-0 flex flex-col gap-2 "
        title={player?.player_name}
        outerCon="p-4 no-scrollbar"
        onClose={handleCloseModal}
        hw="w-[96%] max-h-[96vh] min-h-[96vh] md:w-[60%] lg:w-[40%]"
      >
        {/* Modal header with player image and close button */}
        <PlayerProfileBanner />

        {/* Stats Summary */}
        <PlayerNameAndPosition />

        <div className="flex-1 ">
          <PlayerProfileModalTabContent />
        </div>
      </DialogModal>
    </PlayerDataProvider>
  );
}
