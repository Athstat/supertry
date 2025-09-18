import { Fragment, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Lock, Table2, Users } from 'lucide-react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';
import MyTeamPitchView from './MyTeamPitchView';
import MyTeamEditView from './MyTeamEditView';
import { twMerge } from 'tailwind-merge';
import { calculateTeamTotalSpent } from '../../../utils/athleteUtils';
import PushOptInModal from '../../ui/PushOptInModal';
import { isBridgeAvailable, requestPushPermissions } from '../../../utils/bridgeUtils';
import { useFantasyLeagueTeam } from './FantasyLeagueTeamProvider';

export default function ViewMyTeam({
  leagueRound,
  leagueConfig,
  team,
  onBack,
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

  const [viewMode, setViewMode] = useState<'edit' | 'pitch'>('pitch');

  const {totalSpent, selectedCount} = useFantasyLeagueTeam();
  const budgetRemaining = (leagueConfig?.team_budget || 0) - totalSpent;

  const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);

  // Push opt-in prompt state
  const [showPushModal, setShowPushModal] = useState(false);

  // Show "Enable push" modal on ViewMyTeam if not enabled and supported
  useEffect(() => {
    try {
      const hasPushId = !!localStorage.getItem('onesignal_id');
      const dismissed = localStorage.getItem('push_optin_dismissed') === 'true';

      if (isBridgeAvailable() && !hasPushId && !dismissed) {
        setShowPushModal(true);
      }
    } catch {
      // If localStorage not available, do nothing
    }
  }, []);

  return (
    <div className="w-full py-4">
      <div className="flex flex-row items-center justify-between mb-5">
        <div className="flex flex-row items-center gap-2" style={{ marginTop: -20 }}>
          {/* <button
            type="button"
            onClick={() => onBack && onBack()}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Back to rounds"
          >
            <ArrowLeft />
          </button> */}
          <div className="flex flex-col">
            <p className="font-bold text-xl">My Team</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
              Your team for {leagueRound?.title}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            // disabled={isLocked}
            className={twMerge(
              'px-3 py-1.5 rounded-lg text-sm flex flex-row items-center gap-2 font-medium border border-gray-200 dark:border-gray-700`',
              'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 dark:border-slate-700',
              viewMode === 'edit' && 'bg-blue-600 text-white'
            )}
          >
            <p>Edit</p>
            {isLocked && <Lock className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('pitch')}
            className={`${
              viewMode === 'pitch'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            } px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700`}
          >
            Pitch
          </button>
        </div>
      </div>

      {/* Top stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Selected
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {selectedCount}/6
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Budget
          </div>
          {leagueConfig && (
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {budgetRemaining}/{leagueConfig?.team_budget}
            </div>
          )}
        </div>
      </div>

      {viewMode === 'edit' ? (
        // 2x3 grid of slots with player cards
        <Fragment>
          <MyTeamEditView
            leagueConfig={leagueConfig}
            leagueRound={leagueRound}
            team={team}
            onTeamUpdated={onTeamUpdated}
            onEditChange={onEditChange}
          />
        </Fragment>
      ) : (
        // Pitch view
        <Fragment>
          {leagueRound && (
            <MyTeamPitchView
              leagueRound={leagueRound}
              team={team}
            />
          )}
        </Fragment>
      )}

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
          } catch {}
          setShowPushModal(false);
        }}
      />
    </div>
  );
}
