import { Activity, useState } from 'react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import MyTeamPitchView from './MyTeamPitchView';
import MyTeamEditView from './MyTeamEditView';
import { useMyTeamView } from './MyTeamStateProvider';
import PushOptInModal from '../../ui/PushOptInModal';
import { requestPushPermissions } from '../../../utils/bridgeUtils';
import MyTeamViewHeader from './MyTeamViewHeader';

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
