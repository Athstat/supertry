import { Activity, useState } from 'react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import MyTeamPitchView from './MyTeamPitchView';
import MyTeamEditView from './MyTeamEditView';
import { useMyTeamView } from './MyTeamStateProvider';
import PushOptInModal from '../../ui/PushOptInModal';
import { requestPushPermissions } from '../../../utils/bridgeUtils';
import MyTeamViewHeader from './MyTeamViewHeader';
import PlayerPickerV2 from '../../player-picker/PlayerPickerV2';
import { PositionClass } from '../../../types/athletes';
import { useFantasyLeagueTeam } from './FantasyLeagueTeamProvider';

export default function ViewMyTeam({
  leagueRound,
  leagueConfig,
  team,
  onTeamUpdated,
  onEditChange,
}: {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  team: IFantasyLeagueTeam;
  onBack?: () => void;
  onTeamUpdated: () => Promise<void>;
  onEditChange?: (isEditing: boolean) => void;
}) {
  const { viewMode } = useMyTeamView();
    const {cancelSwap, slots, swapState, completeSwap, swapPlayer, budgetRemaining } = useFantasyLeagueTeam();

  // Push opt-in prompt state
  const [showPushModal, setShowPushModal] = useState(false);

  return (
    <div className="w-full ">

      {leagueConfig && leagueRound && (<MyTeamViewHeader
        onTeamUpdated={onTeamUpdated}
        leagueConfig={leagueConfig}
        leagueRound={leagueRound}
      />)}

      <Activity mode={viewMode === 'edit' ? "visible" : "hidden"} >
        <MyTeamEditView
          leagueConfig={leagueConfig}
          leagueRound={leagueRound}
          team={team}
          onEditChange={onEditChange}
        />
      </Activity>

      <Activity mode={viewMode === "pitch" ? "visible" : "hidden"} >
        {leagueRound && (
          <MyTeamPitchView
            leagueRound={leagueRound}
            team={team}
          />
        )}
      </Activity>

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
            console.log("Local Storage error ", err);
          }
          setShowPushModal(false);
        }}
      />
    </div>
  );
}
