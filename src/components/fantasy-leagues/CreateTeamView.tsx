import { useMemo, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';

import PlayerProfileModal from '../player/PlayerProfileModal';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { isLeagueRoundLocked } from '../../utils/leaguesUtils';
import NoContentCard from '../shared/NoContentMessage';
import { useTabView } from '../shared/tabs/TabView';

import PlayerPickerV2 from '../player-picker/PlayerPickerV2';
import { useCreateFantasyTeam } from '../../hooks/fantasy/useCreateFantasyTeam';
import { FantasyTeamFormation3D } from '../team/FantasyTeamFormation';
import TeamBenchDrawer from './my-team/TeamBenchDrawer';
import { useHideBottomNavBar } from '../../hooks/navigation/useNavigationBars';
import { IProAthlete } from '../../types/athletes';
import CreateTeamViewHeader from './my-team/CreateTeamViewHeader';
import { PlayerActionModal } from '../team/PlayerActionModal';


export default function CreateTeamView() {

  const { leagueRound, swapState, budgetRemaining, swapPlayer, completeSwap, cancelSwap } = useCreateFantasyTeam();


  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileModalPlayer, setProfileModalPlayer] = useState<IFantasyTeamAthlete>();
  const [actionModalPlayer, setActionModalPlayer] = useState<IFantasyTeamAthlete>();

  const { navigate: tabNavigate } = useTabView();
  useHideBottomNavBar();

  const excludePlayers = useMemo(() => {
    return swapPlayer ? [swapPlayer] : []
  }, [swapPlayer])

  const onClosePickerModal = () => {
    cancelSwap();
  }

  const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);

  const handleGoToStandings = () => {
    tabNavigate('standings');
  };

  const handleClosePlayerProfile = () => {
    setProfileModalPlayer(undefined);
    setShowProfileModal(false);
  }

  const handleViewPlayerProfile = (player: IFantasyTeamAthlete) => {
    setProfileModalPlayer(player);
    setShowProfileModal(true);
  }

  const handleOpenActionModal = (player: IFantasyTeamAthlete) => {
    setActionModalPlayer(player);
  }

  const handleCloseActionModal = () => {
    setActionModalPlayer(undefined);
  }

  const handleCompleteSwap = (player: IProAthlete) => {
    completeSwap(player);
    console.log("Ran complete Swap Function! ", player);
  }

  // Add Delay to make sure team is fully loaded


  if (!leagueRound) return;

  if (isLocked) {
    return (
      <div className="flex flex-col items-center justify-center gap-1">
        <NoContentCard message="Whoops! Round has been locked, you can't pick your team now" />

        <PrimaryButton onClick={handleGoToStandings} className="w-fit">
          View Standings
        </PrimaryButton>
      </div>
    );
  }


  return (
    <div className="w-full flex flex-col">


      <CreateTeamViewHeader />

      <div className='relative' >
        <FantasyTeamFormation3D
          onPlayerClick={handleOpenActionModal}
          marginCN='mt-0'
          firstRowMargin='mt-8'
        />

        <TeamBenchDrawer
          onPlayerClick={handleOpenActionModal}
        />
      </div>


      {<PlayerPickerV2
        isOpen={swapState.open}
        positionPool={swapState.position?.positionClass ?? undefined}
        remainingBudget={budgetRemaining}
        excludePlayers={excludePlayers}
        onSelectPlayer={handleCompleteSwap}
        onClose={onClosePickerModal}
        targetLeagueRound={leagueRound}
      />}

      {actionModalPlayer && <PlayerActionModal
        player={actionModalPlayer}
        onClose={handleCloseActionModal}
        onViewProfile={handleViewPlayerProfile}
      />}


      {/* Player profile modal */}
      {profileModalPlayer && (
        <PlayerProfileModal
          player={profileModalPlayer}
          isOpen={showProfileModal}
          onClose={handleClosePlayerProfile}
        />
      )}


    </div>
  );
}


