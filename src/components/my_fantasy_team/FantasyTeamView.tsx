import { useState } from 'react';
import MyTeamViewHeader from './MyTeamViewHeader';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../types/leagueConfig';
import { requestPushPermissions } from '../../utils/bridgeUtils';
import PlayerPicker from '../player_picker/PlayerPicker';
import PushOptInModal from '../ui/PushOptInModal';
import MyTeamPitchView from './MyTeamPitchView';
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

  return (
    <div className="w-full h-full">
      <MyTeamViewHeader />

      <MyTeamPitchView 
        className={pitchCN}
      />
    </div>
  );
}
