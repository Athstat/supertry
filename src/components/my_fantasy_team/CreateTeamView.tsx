import { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../ui/buttons/PrimaryButton';

import PlayerProfileModal from '../player/PlayerProfileModal';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { isSeasonRoundLocked } from '../../utils/leaguesUtils';
import NoContentCard from '../ui/typography/NoContentMessage';
import { useTabView } from '../ui/tabs/TabView';

import PlayerPicker from '../player_picker/PlayerPicker';
import { useCreateFantasyTeam } from '../../hooks/fantasy/useCreateFantasyTeam';
import { FantasyTeamFormation3D } from './FantasyTeamFormation3D';
import { IProAthlete } from '../../types/athletes';
import { PlayerActionModal } from './PlayerActionModal';
import CreateTeamViewHeader from './CreateTeamViewHeader';
import TeamBenchDrawer from './TeamBenchDrawer';
import { useTutorial } from '../../hooks/tutorials/useTutorial';
import { TUTORIAL_IDS } from '../../tutorials/tutorialIds';
import { CREATE_TEAM_TUTORIAL_STEP_INDEX } from '../../tutorials/createTeamTutorial';
import CoachScrummyBanner from '../tutorials/CoachScrummyBanner';
import { useLocation } from 'react-router-dom';

/** Renders a create team view */
export default function CreateFantasyTeamView() {

  const { leagueRound, swapState, budgetRemaining, swapPlayer, completeSwap, cancelSwap, slots } = useCreateFantasyTeam();

  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [profileModalPlayer, setProfileModalPlayer] = useState<IFantasyTeamAthlete>();
  const [actionModalPlayer, setActionModalPlayer] = useState<IFantasyTeamAthlete>();

  const { navigate: tabNavigate } = useTabView();
  const location = useLocation();
  const { isActive, stepIndex, setStepIndex, enterFreeRoam, isFreeRoam } = useTutorial();
  const isCreateTeamTutorialActive = isActive(TUTORIAL_IDS.CREATE_TEAM);

  const slot1HasAthlete = useMemo(() => {
    const slot1 = slots.find((s) => s.slotNumber === 1);
    return Boolean(slot1?.athlete);
  }, [slots]);

  const slot1IsCaptain = useMemo(() => {
    const slot1 = slots.find((s) => s.slotNumber === 1);
    return Boolean(slot1?.isCaptain);
  }, [slots]);

  const slot2HasAthlete = useMemo(() => {
    const slot2 = slots.find((s) => s.slotNumber === 2);
    return Boolean(slot2?.athlete);
  }, [slots]);

  const excludePlayers = useMemo(() => {
    const alreadySelectedPlayers: IFantasyTeamAthlete[] = [];

    slots.forEach((s) => {
      if (s.athlete && s.athlete.tracking_id !== swapPlayer?.tracking_id) {
        alreadySelectedPlayers.push(s.athlete);
      }
    })

    return swapPlayer ? [swapPlayer, ...alreadySelectedPlayers] : [...alreadySelectedPlayers]
  }, [slots, swapPlayer])

  const onClosePickerModal = () => {
    cancelSwap();
  }

  const isLocked = leagueRound && isSeasonRoundLocked(leagueRound);

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

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex === CREATE_TEAM_TUTORIAL_STEP_INDEX.DASHBOARD_CTA &&
      location.pathname.startsWith('/my-team')
    ) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.INTRO);
    }
  }, [
    isCreateTeamTutorialActive,
    location.pathname,
    setStepIndex,
    stepIndex,
  ]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (stepIndex === CREATE_TEAM_TUTORIAL_STEP_INDEX.SLOT_1_EMPTY && swapState.open) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.PLAYER_PICKER_SLOT_1);
    }
  }, [isCreateTeamTutorialActive, stepIndex, swapState.open, setStepIndex]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex <= CREATE_TEAM_TUTORIAL_STEP_INDEX.PLAYER_PICKER_SLOT_1 &&
      slot1HasAthlete &&
      !swapState.open
    ) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.SLOT_1_PLAYER);
    }
  }, [
    isCreateTeamTutorialActive,
    slot1HasAthlete,
    stepIndex,
    swapState.open,
    setStepIndex,
  ]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex <= CREATE_TEAM_TUTORIAL_STEP_INDEX.SLOT_1_PLAYER &&
      actionModalPlayer
    ) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.ACTION_MODAL_SWAP);
    }
  }, [
    isCreateTeamTutorialActive,
    actionModalPlayer,
    stepIndex,
    setStepIndex,
  ]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex === CREATE_TEAM_TUTORIAL_STEP_INDEX.ACTION_MODAL_SWAP &&
      swapState.open
    ) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.PLAYER_PICKER_SWAP);
    }
  }, [
    isCreateTeamTutorialActive,
    stepIndex,
    swapState.open,
    setStepIndex,
  ]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex === CREATE_TEAM_TUTORIAL_STEP_INDEX.PLAYER_PICKER_SWAP &&
      slot1HasAthlete &&
      !swapState.open
    ) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.SLOT_1_PLAYER_CAPTAIN_PROMPT);
    }
  }, [
    isCreateTeamTutorialActive,
    stepIndex,
    slot1HasAthlete,
    swapState.open,
    setStepIndex,
  ]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex === CREATE_TEAM_TUTORIAL_STEP_INDEX.SLOT_1_PLAYER_CAPTAIN_PROMPT &&
      actionModalPlayer
    ) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.ACTION_MODAL_CAPTAIN);
    }
  }, [
    isCreateTeamTutorialActive,
    stepIndex,
    actionModalPlayer,
    setStepIndex,
  ]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex === CREATE_TEAM_TUTORIAL_STEP_INDEX.ACTION_MODAL_CAPTAIN &&
      slot1IsCaptain
    ) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.AFTER_CAPTAIN_NEXT);
    }
  }, [
    isCreateTeamTutorialActive,
    stepIndex,
    slot1IsCaptain,
    setStepIndex,
  ]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex === CREATE_TEAM_TUTORIAL_STEP_INDEX.SLOT_2_EMPTY &&
      swapState.open
    ) {
      setStepIndex(CREATE_TEAM_TUTORIAL_STEP_INDEX.PLAYER_PICKER_PRICE);
    }
  }, [
    isCreateTeamTutorialActive,
    stepIndex,
    swapState.open,
    setStepIndex,
  ]);

  useEffect(() => {
    if (!isCreateTeamTutorialActive) {
      return;
    }

    if (
      stepIndex === CREATE_TEAM_TUTORIAL_STEP_INDEX.PLAYER_PICKER_PICK &&
      slot2HasAthlete &&
      !swapState.open
    ) {
      enterFreeRoam(TUTORIAL_IDS.CREATE_TEAM);
    }
  }, [
    isCreateTeamTutorialActive,
    stepIndex,
    slot2HasAthlete,
    swapState.open,
    enterFreeRoam,
  ]);

  const handleCompleteSwap = (player: IProAthlete) => {
    completeSwap(player);
    onClosePickerModal();
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
    <div className="w-full flex flex-col" data-tutorial="my-team-intro">

      <CreateTeamViewHeader />

      {isCreateTeamTutorialActive && isFreeRoam && (
        <div className="px-4 mt-3">
          <CoachScrummyBanner
            message="Pick the rest of your team. When you’re ready, tap Create Team."
            dataTutorial="coach-scrummy-banner"
          />
        </div>
      )}

      <div className='relative' >
        <FantasyTeamFormation3D
          onPlayerClick={handleOpenActionModal}
          marginCN='mt-8'
          firstRowMargin='mt-8'
        />

        <TeamBenchDrawer
          onPlayerClick={handleOpenActionModal}
        />
      </div>


      {<PlayerPicker
        isOpen={swapState.open}
        positionPool={swapState.position?.positionClass ?? undefined}
        remainingBudget={budgetRemaining}
        excludePlayers={excludePlayers}
        onSelectPlayer={handleCompleteSwap}
        onClose={onClosePickerModal}
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
