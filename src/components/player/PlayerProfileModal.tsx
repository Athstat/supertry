import PlayerProfileBanner from './profile-modal-components/PlayerProfileBanner';
import PlayerNameAndPosition from './profile-modal-components/PlayerNameAndPosition';
import PlayerProfileModalTabContent from './profile-modal-components/PlayerProfileModalTabContent';
import { IProAthlete } from '../../types/athletes';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { Activity, useCallback, useEffect, useRef, useState } from 'react';
import { analytics } from '../../services/analytics/anayticsService';
import PlayerDataProvider, { usePlayerData } from '../../providers/PlayerDataProvider';
import BottomSheetView from '../ui/BottomSheetView';
import { twMerge } from 'tailwind-merge';
import { lighterDarkBlueCN } from '../../types/constants';
import PlayerFixtureModal from '../fixtures/fixture_screen/PlayerFixtureModal';
import PlayerScoutingActionModal from '../scouting/PlayerScoutingActionModal';
import { useClickOutside } from '../../hooks/useClickOutside';
import RoundedCard from '../shared/RoundedCard';

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
  const { selectedFixture } = usePlayerData();

  const handleClickOutSide = () => {
    if (selectedFixture && player) {
      return;
    }

    handleCloseModal();
  }

  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, handleClickOutSide);

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
    <PlayerDataProvider onClose={handleCloseModal} player={player} loadingFallback={<DefaultLoadingSkeleton onClose={handleCloseModal} />} >
      <Activity mode={isOpen ? "visible" : "hidden"} >
        <div ref={ref} className='w-fit' >
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

          <PlayerScoutingActionModalWrapper />

        </div>
      </Activity>
    </PlayerDataProvider>
  );
}

function PlayerFixtureModalWrapper() {

  const { selectedFixture, setSelectedFixture, player } = usePlayerData();

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
          showMatchInfo
          hideViewPlayerProfile
        />
      </div>}
    </>
  )
}

function PlayerScoutingActionModalWrapper() {

  const { player, setShowScoutingActionModal, showScoutingActionModal } = usePlayerData();
  const onCloseModal = () => setShowScoutingActionModal(false);

  if (!player) {
    return null;
  }

  return (
    <PlayerScoutingActionModal
      isOpen={showScoutingActionModal}
      player={player}
      onClose={onCloseModal}
    />
  )
}


type LoadingProps = {
  onClose?: () => void
}

function DefaultLoadingSkeleton({ onClose }: LoadingProps) {

  const divRef = useRef<HTMLDivElement>(null);
  useClickOutside(divRef, onClose);

  return (
    <div ref={divRef} >
      <BottomSheetView
        className={twMerge(
          "p-0 flex flex-col gap-6 min-h-[95vh] overflow-y-auto",
          lighterDarkBlueCN
        )}

        hideHandle
      >
        <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[200px]"></RoundedCard>

        <div className="flex flex-row px-4 justify-between">
          <div className="flex flex-col gap-2">
            <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[30px] w-[120px]" />
            <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[30px] w-[60px]" />
          </div>

          <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[30px] w-[60px]" />
        </div>

        <div className="flex px-4 flex-row gap-2 items-center">
          <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[60px] flex-1 " />
          <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[60px] flex-1" />
        </div>

        <div className='flex flex-col gap-4 px-4' >
          <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[100px] w-full" />
          <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[50px] w-full" />
          <RoundedCard className="animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[100px] w-full" />
        </div>
      </BottomSheetView>
    </div>
  )
}
