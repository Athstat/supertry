import { useState } from 'react';
import MyTeamViewHeader from './MyTeamViewHeader';
import { useFantasyTeam } from '../../hooks/fantasy/useFantasyTeam';
import { PositionClass } from '../../types/athletes';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../types/leagueConfig';
import { requestPushPermissions } from '../../utils/bridgeUtils';
import PlayerPicker from '../player_picker/PlayerPicker';
import PushOptInModal from '../ui/PushOptInModal';
import MyTeamPitchView from './MyTeamPitchView';
import { useMyTeam } from '../../hooks/fantasy/my_team/useMyTeam';
import { useMyTeamActions } from '../../hooks/fantasy/my_team/useMyTeamActions';

type Props = {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  onBack?: () => void;
  onEditChange?: (isEditing: boolean) => void;
  pitchCN?: string
}

/** Renders a fantasy team view, with editor capabilities */
export default function FantasyTeamView({ leagueRound, pitchCN }: Props) {

  const {cancelSwap, slots, swapState, completeSwap, swapBudget} = useMyTeamActions();

  const exludePlayers = slots
    .filter(s => Boolean(s.athlete))
    .map(s => {
      return { tracking_id: s.athlete?.tracking_id ?? '' };
    })

  const isPlayerPickerOpen = Boolean(swapState.slot);

  const handleOnEnable = async () => {
    try {
      await requestPushPermissions();
    } catch (e) {
      console.error('Push permission error:', e);
    } finally {
      setShowPushModal(false);
    }
  }

  const handleOnNotNow = () => {
    try {
      localStorage.setItem('push_optin_dismissed', 'true');
    } catch (err) {
      console.log('Local Storage error ', err);
    }
    setShowPushModal(false);
  }

  // Push opt-in prompt state
  const [showPushModal, setShowPushModal] = useState(false);

  return (
    <div className="w-full h-full">
      <MyTeamViewHeader />

      <MyTeamPitchView 
        className={pitchCN}
      />

      <PlayerPicker
        isOpen={isPlayerPickerOpen}
        positionPool={swapState.slot?.position.position_class}
        remainingBudget={swapBudget}
        excludePlayers={exludePlayers}
        onSelectPlayer={completeSwap}
        onClose={cancelSwap}
        targetLeagueRound={leagueRound}
        playerToBeReplaced={swapState.slot?.athlete?.athlete}
      />

      <PushOptInModal
        visible={showPushModal}
        onEnable={handleOnEnable}
        onNotNow={handleOnNotNow}
      />
    </div>
  );
}
