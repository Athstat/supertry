import { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';

import { Position } from '../../types/position';
import PlayerSelectionModal from '../team-creation/PlayerSelectionModal';
import { RugbyPlayer } from '../../types/rugbyPlayer';
import { seasonService } from '../../services/seasonsService';
import { useParams } from 'react-router-dom';
import { PlayerGameCard } from '../player/PlayerGameCard';
import { IProAthlete } from '../../types/athletes';
import PlayerProfileModal from '../player/PlayerProfileModal';
// import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { IGamesLeagueConfig } from '../../types/leagueConfig';
import { leagueService } from '../../services/leagueService';
import { authService } from '../../services/authService';
import { ICreateFantasyTeamAthleteItem } from '../../types/fantasyTeamAthlete';
import { ArrowLeft, Check, Loader, Users } from 'lucide-react';
import { Toast } from '../ui/Toast';
import { LoadingState } from '../ui/LoadingState';

export default function CreateMyTeam({
  leagueRound,
  leagueConfig,
  onTeamCreated,
  onViewTeam,
  onBack,
}: {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  onTeamCreated?: (team: IFantasyLeagueTeam) => void;
  onViewTeam?: () => void;
  onBack?: () => void;
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, IProAthlete>>({});
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [players, setPlayers] = useState<IProAthlete[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete | undefined>(undefined);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const totalSpent = Object.values(selectedPlayers).reduce(
    (sum, player) => sum + (player.price || 0),
    0
  );
  const budgetRemaining = (leagueConfig?.team_budget || 0) - totalSpent;
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: 'error' | 'success' | 'info';
  }>({
    isVisible: false,
    message: '',
    type: 'error',
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
    setToast({ isVisible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 5000);
  };

  const selectedRoundId = useMemo(() => leagueRound?.id, [leagueRound?.id]);

  const { leagueId } = useParams();

  console.log('leagueRound: ', leagueRound);

  useEffect(() => {
    const loadAthletes = async () => {
      if (!leagueRound) return;
      try {
        //const athletes = await seasonService.getSeasonAthletes(leagueId);
        const athletes = await seasonService.getSeasonAthletes(leagueRound.season_id);
        setPlayers(athletes);
        console.log('athletes: ', athletes);
      } catch (e) {
        console.error('Failed to load athletes for season ', leagueId, e);
      } finally {
        setIsLoading(false);
      }
    };

    loadAthletes();
  }, [leagueRound]);

  const positions = [
    { name: 'Front Row', position_class: 'front-row' },
    { name: 'Second Row', position_class: 'second-row' },
    { name: 'Back Row', position_class: 'back-row' },
    { name: 'Halfback', position_class: 'half-back' },
    { name: 'Back', position_class: 'back' },
    { name: 'Super Sub', position_class: 'super-sub', isSpecial: true },
  ];

  const toPosition = (
    p: { name: string; position_class: string; isSpecial?: boolean },
    index: number
  ): Position => ({
    id: p.position_class || String(index),
    name: p.name,
    shortName: p.name.slice(0, 2).toUpperCase(),
    x: '0',
    y: '0',
    positionClass: p.position_class,
    isSpecial: Boolean(p.isSpecial),
  });

  const handleSave = async () => {
    if (!leagueRound || isLoading) {
      return;
    }

    if (!leagueConfig) {
      return;
    }

    //if the user hasn't selected a captain then show them a toast asking them to select one
    if (!captainId) {
      showToast('Please select a captain');
      return;
    }

    try {
      setIsSaving(true);
      setIsSubmitting(true);
      setSaveError(undefined);

      const userInfo = await authService.getUserInfo();
      if (!userInfo?.kc_id) {
        setSaveError('You must be logged in to save a team.');
        setIsSaving(false);
        return;
      }

      const teamName = `${userInfo.username} - ${leagueRound.title}`;

      const athletes: ICreateFantasyTeamAthleteItem[] = positions
        .map((p, index) => {
          const selected = selectedPlayers[p.name];
          if (!selected) return undefined;
          const isSuperSub = p.isSpecial === true;
          return {
            athlete_id: selected.tracking_id,
            purchase_price: selected.price || 0,
            purchase_date: new Date(),
            is_starting: !isSuperSub,
            slot: index + 1,
            is_super_sub: isSuperSub,
            is_captain: selected.tracking_id === captainId || false,
          } as ICreateFantasyTeamAthleteItem;
        })
        .filter(Boolean) as ICreateFantasyTeamAthleteItem[];

      const response = await leagueService.joinLeague(
        leagueRound.id,
        userInfo.kc_id,
        teamName,
        athletes
      );

      console.log('Join league response:', response);
      // Best-effort mapping to IFantasyLeagueTeam
      const createdTeam: IFantasyLeagueTeam = {
        id: response?.team?.id ?? response?.id ?? '',
        team_id: String(response?.team?.id ?? response?.id ?? ''),
        league_id: Number(leagueRound.id),
        rank: response?.team?.rank ?? 0,
        overall_score: response?.team?.overall_score ?? 0,
        team_name: response?.team?.team_name ?? teamName,
        user_id: userInfo.kc_id,
        first_name: (userInfo as any).first_name ?? '',
        last_name: (userInfo as any).last_name ?? '',
        athletes: Array.isArray(response?.team?.athletes) ? response.team.athletes : [],
      };

      // Show success modal
      setShowSuccessModal(true);

      // If parent wants to handle success, notify it
      if (onTeamCreated) {
        onTeamCreated(createdTeam);
      }
    } catch (error) {
      console.error('Failed to save team:', error);
      setSaveError(
        error instanceof Error ? error.message : 'Failed to save team. Please try again.'
      );
    } finally {
      setIsSaving(false);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingState message="Loading..." />
      </div>
    );
  }

  if (!leagueConfig) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-red-500 text-lg mb-4">Failed to load league configuration</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
            <p className="font-bold text-xl">Create Team</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
              Create your team for {leagueRound?.title}
            </p>
          </div>
        </div>
      </div>
      {/* Top stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Selected
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {Object.keys(selectedPlayers).length}/6
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
          <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Budget
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {budgetRemaining}/{leagueConfig?.team_budget}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-3">
        <PrimaryButton
          className="w-full"
          disabled={isSaving || Object.keys(selectedPlayers).length !== 6 || !leagueRound}
          onClick={handleSave}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </PrimaryButton>
        {saveError && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">{saveError}</div>
        )}

        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.isVisible}
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
        />
      </div>

      {/* 2x3 grid of position slots */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        {positions.map((p, index) => {
          const selected = selectedPlayers[p.name];
          return (
            <div key={p.position_class} className="flex flex-col w-full">
              <button
                onClick={() => {
                  const pos = toPosition(p, index);
                  setActivePosition(pos);
                  if (selected) {
                    setPlayerModalPlayer(selected);
                    setShowPlayerModal(true);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="aspect-square overflow-hidden p-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 flex items-center justify-center"
              >
                {selected ? (
                  <PlayerGameCard
                    player={selected}
                    name={p.name}
                    className="w-full h-full"
                    blockGlow
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-3xl">+</span>
                    <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{p.name}</span>
                  </div>
                )}
              </button>

              {selected && (
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    className={`${
                      captainId === selected.tracking_id
                        ? 'text-xs w-full rounded-lg py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                        : 'text-xs w-full rounded-lg py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    }`}
                    onClick={() => {
                      if (captainId !== selected.tracking_id) setCaptainId(selected.tracking_id);
                    }}
                    disabled={captainId === selected.tracking_id}
                  >
                    {captainId === selected.tracking_id ? 'Captain' : 'Set as Captain'}
                  </button>
                  <button
                    className="text-xs w-full rounded-lg py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/50"
                    onClick={() => {
                      setSelectedPlayers(prev => {
                        const copy = { ...prev } as Record<string, IProAthlete>;
                        delete copy[p.name];
                        return copy;
                      });
                      if (captainId === selected.tracking_id) setCaptainId(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && activePosition && (
        <PlayerSelectionModal
          visible={isModalOpen}
          selectedPosition={activePosition}
          players={players}
          remainingBudget={
            (leagueConfig?.team_budget || 240) -
            Object.values(selectedPlayers).reduce((sum, p) => sum + (p.price || 0), 0)
          }
          selectedPlayers={Object.values(selectedPlayers).map(p => ({
            tracking_id: p.tracking_id,
          }))}
          handlePlayerSelect={rugbyPlayer => {
            setSelectedPlayers(prev => ({ ...prev, [activePosition.name]: rugbyPlayer }));
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
          roundId={parseInt(selectedRoundId || '0')}
          roundStart={leagueRound?.start_round ?? undefined}
          roundEnd={leagueRound?.end_round ?? undefined}
          leagueId={leagueId}
        />
      )}

      {/* Player profile modal */}
      {playerModalPlayer && (
        <PlayerProfileModal
          player={playerModalPlayer}
          isOpen={showPlayerModal}
          onClose={() => {
            setPlayerModalPlayer(undefined);
            setShowPlayerModal(false);
          }}
        />
      )}

      {/* Loading Modal */}
      {isSaving && !showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-primary-500 dark:text-primary-400">
                <Loader className="w-10 h-10 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Joining the Scrum...</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Please wait while we save your team.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Submitted!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your team has been successfully submitted
                {leagueRound ? ` to ${leagueRound.title}` : ''}.
              </p>
              <PrimaryButton
                className="w-full"
                onClick={() => {
                  setShowSuccessModal(false);
                  onViewTeam();
                }}
              >
                Let's Go!
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
