import PlayerProfileBanner from './profile-modal-components/PlayerProfileBanner';
import PlayerNameAndPosition from './profile-modal-components/PlayerNameAndPosition';
import PlayerProfileModalTabContent from './profile-modal-components/PlayerProfileModalTabContent';
import { IProAthlete } from '../../types/athletes';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { Activity, useCallback, useEffect, useState } from 'react';
import { analytics } from '../../services/analytics/anayticsService';
import PlayerDataProvider, { usePlayerData } from '../../providers/PlayerDataProvider';
import BottomSheetView from '../ui/BottomSheetView';
import { twMerge } from 'tailwind-merge';
import { lighterDarkBlueCN } from '../../types/constants';
import PlayerFixtureModal from '../fixtures/fixture_screen/PlayerFixtureModal';

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
      <Activity mode={isOpen ? "visible" : "hidden"} >
        <BottomSheetView
          className={twMerge(
            "p-0 flex flex-col gap-2 min-h-[95vh]",
            lighterDarkBlueCN
          )}

          noAnimation
          hideHandle
        >
          {/* Modal header with player image and close button */}
          <PlayerProfileBanner
            onClose={onClose}
          />

          <div className='px-4' >
            {/* Stats Summary */}
            <PlayerNameAndPosition />

            <div className="flex-1 ">
              <PlayerProfileModalTabContent />
            </div>
          </div>
        </BottomSheetView>

        <PlayerFixtureModalWrapper />


      </Activity>
    </PlayerDataProvider>
  );
}

function PlayerFixtureModalWrapper() {
  
  const {selectedFixture, setSelectedFixture, player} = usePlayerData();
  
  const handleCloseFixtureModal = () => {
    setSelectedFixture(undefined);
  }
  
  return (
    <>
      {selectedFixture && player && <div className="absolute top-0 left-0 right-0 h-screen" >
        <PlayerFixtureModal
          player={player}
          fixture={selectedFixture}
          isOpen={Boolean(selectedFixture)}
          onClose={handleCloseFixtureModal}
          className="z-30"
        />
      </div>}
    </>
  )
}
