import { Fragment, useMemo, useState } from 'react';
import { ArrowLeft, Lock, Plus } from 'lucide-react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';
import MyTeamPitchView from './MyTeamPitchView';
import MyTeamEditView from './MyTeamEditView';
import { twMerge } from 'tailwind-merge';
import { Toast } from '../../ui/Toast';
import { teamPresetsService } from '../../../services/fantasy/teamPresetsService';
import { authService } from '../../../services/authService';
import { Bookmark } from 'lucide-react';
import { BookmarkPlus } from 'lucide-react';

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
  // Save preset modal + feedback
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [makeDefault, setMakeDefault] = useState(true);
  const [savingPreset, setSavingPreset] = useState(false);
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const totalSpent = team.athletes.reduce((sum, player) => sum + (player.price || 0), 0);
  const budgetRemaining = (leagueConfig?.team_budget || 0) - totalSpent;

  const editableAthletesBySlot = useMemo(() => {
    const map: Record<number, IFantasyTeamAthlete | undefined> = {};
    (team.athletes || []).forEach(a => {
      if (a?.slot != null) map[a.slot] = { ...a } as IFantasyTeamAthlete;
    });
    return map;
  }, [team]);

  const selectedCount = (team.athletes || []).length;

  const openSavePresetModal = () => {
    const defaultName = leagueRound?.title ? `${leagueRound.title} Team` : 'My Team';
    setPresetName(defaultName);
    setMakeDefault(true);
    setShowPresetModal(true);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3500);
  };

  const handleSavePreset = async () => {
    if (!leagueRound) return;
    try {
      setSavingPreset(true);
      const user = await authService.getUserInfo();
      if (!user?.kc_id) {
        showToast('Please sign in to save presets', 'error');
        return;
      }

      const athletes = (team.athletes || []).map(a => ({
        athlete_id: a.tracking_id || a.athlete_id,
        slot: a.slot,
        is_starting: a.is_starting ?? true,
        is_captain: a.is_captain ?? false,
        purchase_price: a.purchase_price ?? a.price ?? 0,
      }));

      await teamPresetsService.create({
        user_id: user.kc_id,
        name: presetName?.trim() || (leagueRound?.title ? `${leagueRound.title} Team` : 'My Team'),
        fantasy_league_group_id: leagueRound.fantasy_league_group_id,
        athletes,
        is_default: makeDefault,
      });

      showToast(
        makeDefault ? 'Default preset updated for this league.' : 'Team preset saved successfully!',
        'success'
      );
      setShowPresetModal(false);
    } catch (e) {
      console.error('Failed to save preset', e);
      showToast('Failed to save preset', 'error');
    } finally {
      setSavingPreset(false);
    }
  };

  const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);

  return (
    <div className="w-full py-4">
      <div className="flex flex-row items-center justify-between mb-5">
        <div className="flex flex-row items-center gap-2" style={{ marginTop: -20 }}>
          <button
            type="button"
            onClick={() => onBack && onBack()}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Back to rounds"
          >
            <ArrowLeft />
          </button>
          <div className="flex flex-col">
            <p className="font-bold text-md">My Team</p>
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
              viewMode === 'edit' && 'bg-blue-600 text-white',
              isLocked && 'opacity-60 cursor-not-allowed'
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

      {/* Floating Save-as-Preset FAB */}
      {selectedCount === 6 && budgetRemaining >= 0 && (
        <button
          type="button"
          onClick={openSavePresetModal}
          className="fixed bottom-20 right-4 z-[60] rounded-full w-14 h-14 bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 active:scale-95"
          aria-label="Save team as preset"
        >
          <BookmarkPlus className="w-6 h-6" />
        </button>
      )}

      {/* Save Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Save Team as Preset</h2>

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Preset name
            </label>
            <input
              value={presetName}
              onChange={e => setPresetName(e.target.value)}
              className="w-full mb-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Team – Week 3"
            />

            <label className="inline-flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={makeDefault}
                onChange={e => setMakeDefault(e.target.checked)}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Make this the default preset for this league
              </span>
            </label>

            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                onClick={() => setShowPresetModal(false)}
                disabled={savingPreset}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                onClick={handleSavePreset}
                disabled={savingPreset}
              >
                {savingPreset ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
      />

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
              editableAthletesBySlot={editableAthletesBySlot}
              leagueRound={leagueRound}
              team={team}
            />
          )}
        </Fragment>
      )}
    </div>
  );
}
