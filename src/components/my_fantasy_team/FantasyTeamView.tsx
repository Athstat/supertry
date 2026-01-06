import { useState } from 'react';
import { IFantasyLeagueRound } from '../../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import MyTeamPitchView from './MyTeamPitchView';
import PushOptInModal from '../../ui/PushOptInModal';
import { requestPushPermissions } from '../../../utils/bridgeUtils';
import MyTeamViewHeader from './MyTeamViewHeader';
import PlayerPickerV2 from '../../player-picker/PlayerPickerV2';
import { PositionClass } from '../../../types/athletes';
import { useFantasyLeagueTeam } from '../../providers/fantasy_teams/FantasyTeamProvider';

type Props = {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  onBack?: () => void;
  onTeamUpdated: () => Promise<void>;
  onEditChange?: (isEditing: boolean) => void;
}

/** Renders a fantasy team view, with editor capabilities */
export default function FantasyTeamView({ onTeamUpdated,leagueRound }: Props) {

  const { cancelSwap, slots, swapState, completeSwap, swapPlayer, budgetRemaining } =
    useFantasyLeagueTeam();

  // Push opt-in prompt state
  const [showPushModal, setShowPushModal] = useState(false);

  return (
    <div className="w-full h-full">
      <MyTeamViewHeader
        onTeamUpdated={onTeamUpdated}
      />

      {leagueRound && <MyTeamPitchView leagueRound={leagueRound} />}

      <PlayerPickerV2
        isOpen={swapState.open && swapState.slot != null && Boolean(swapState.position)}
        positionPool={swapState?.position?.positionClass as PositionClass}
        remainingBudget={budgetRemaining + (swapPlayer?.purchase_price || 0)}
        excludePlayers={slots
          .filter(s => Boolean(s.athlete))
          .map(s => {
            return { tracking_id: s.athlete?.tracking_id ?? '' };
          })}
        onSelectPlayer={completeSwap}
        onClose={cancelSwap}
        targetLeagueRound={leagueRound}
        playerToBeReplaced={swapPlayer}
      />

      <PushOptInModal
        visible={showPushModal}
        onEnable={async () => {
          try {
            await requestPushPermissions();
          } catch (e) {
            console.error('Push permission error:', e);
          } finally {
            setShowPushModal(false);
          }
        }}
        onNotNow={() => {
          try {
            localStorage.setItem('push_optin_dismissed', 'true');
          } catch (err) {
            console.log('Local Storage error ', err);
          }
          setShowPushModal(false);
        }}
      />
    </div>
  );
}
