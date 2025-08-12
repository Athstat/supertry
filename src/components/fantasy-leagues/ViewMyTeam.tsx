import { useEffect, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { AthleteWithTrackingId, IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { PlayerGameCard } from '../player/PlayerGameCard';
import { PlayerForm, RugbyPlayer } from '../../types/rugbyPlayer';
import PlayerProfileModal from '../player/PlayerProfileModal';
import { IProAthlete } from '../../types/athletes';
import PlayerSelectionModal from '../team-creation/PlayerSelectionModal';
import { Position } from '../../types/position';
import { seasonService } from '../../services/seasonsService';
import { fantasyTeamService } from '../../services/fantasyTeamService';
import PrimaryButton from '../shared/buttons/PrimaryButton';

export default function ViewMyTeam({
  leagueRound,
  team,
  onBack,
}: {
  leagueRound?: IFantasyLeagueRound;
  team: IFantasyLeagueTeam;
  onBack?: () => void;
}) {
  const [captainAthleteId, setCaptainAthleteId] = useState<string | undefined>(
    () => team.athletes?.find(a => a.is_captain)?.athlete_id
  );
  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete | undefined>(undefined);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [players, setPlayers] = useState<RugbyPlayer[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const [swapState, setSwapState] = useState<{
    open: boolean;
    slot: number | null;
    position?: Position | null;
  }>({ open: false, slot: null, position: null });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Stable mapping of 6 slots like in CreateMyTeam
  const positions = [
    { name: 'Front Row', position_class: 'front-row' },
    { name: 'Second Row', position_class: 'second-row' },
    { name: 'Back Row', position_class: 'back-row' },
    { name: 'Halfback', position_class: 'half-back' },
    { name: 'Back', position_class: 'back' },
    { name: 'Super Sub', position_class: 'super-sub', isSpecial: true },
  ];

  const [editableAthletesBySlot, setEditableAthletesBySlot] = useState<
    Record<number, IFantasyTeamAthlete | undefined>
  >(() => {
    const map: Record<number, IFantasyTeamAthlete | undefined> = {};
    (team.athletes || []).forEach(a => {
      if (a?.slot != null) map[a.slot] = { ...a } as IFantasyTeamAthlete;
    });
    return map;
  });

  useEffect(() => {
    // When team changes from parent, reset editable state
    const map: Record<number, IFantasyTeamAthlete | undefined> = {};
    (team.athletes || []).forEach(a => {
      if (a?.slot != null) map[a.slot] = { ...a } as IFantasyTeamAthlete;
    });
    setEditableAthletesBySlot(map);
    setCaptainAthleteId(team.athletes?.find(a => a.is_captain)?.athlete_id);
  }, [team.athletes]);

  const athletesBySlot = editableAthletesBySlot;

  // Minimal mapper to PlayerGameCard shape
  const toIProAthlete = (a: IFantasyTeamAthlete): IProAthlete => ({
    tracking_id: a.tracking_id || a.athlete_id,
    player_name: a.player_name,
    power_rank_rating: a.power_rank_rating || a.total_points || 0,
    image_url: a.image_url,
    position: a.position,
    gender: a.gender || 'M',
    form: 'NEUTRAL' as PlayerForm,
    team_id: String(a.team_id || ''),
    team: {
      athstat_id: '',
      source_id: '',
      athstat_name: a.team_name || '',
      image_url: a.team_logo || a.image_url || '',
      sport: '',
      organization: '',
    },
  });

  const selectedCount = (team.athletes || []).length;

  // Load season players for swapping
  useEffect(() => {
    const loadAthletes = async () => {
      if (!leagueRound) return;
      try {
        const athletes = await seasonService.getSeasonAthletes(leagueRound.season_id);
        const mapped: RugbyPlayer[] = athletes.map(a => ({
          id: a.tracking_id,
          tracking_id: a.tracking_id,
          player_name: a.player_name,
          team_name: a.team?.athstat_name || 'Unknown Team',
          team_logo: a.team?.image_url || '',
          position_class: a.position_class,
          position: a.position,
          price: a.price ?? 0,
          power_rank_rating: a.power_rank_rating ?? 0,
          image_url: a.image_url,
          team_id: a.team_id,
          form: a.form,
          available: a.available,
          scoring: 0,
          defence: 0,
          attacking: 0,
        }));
        setPlayers(mapped);
      } catch (e) {
        console.error('Failed to load athletes for season', e);
      }
    };
    loadAthletes();
  }, [leagueRound]);

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

  const buildPayloadAndSave = async () => {
    if (!leagueRound?.is_open) return;
    try {
      setIsSaving(true);
      setSaveError(undefined);
      const athletesPayload = Object.entries(editableAthletesBySlot)
        .map(([slotStr, a]) => {
          const slot = Number(slotStr);
          if (!a) return undefined;
          return {
            athlete_id: a.athlete_id,
            slot,
            purchase_price: (a as any).price || a.purchase_price || 0,
            is_starting: slot !== 6,
            is_captain: a.athlete_id === captainAthleteId,
          };
        })
        .filter(Boolean) as {
        athlete_id: string;
        slot: number;
        purchase_price: number;
        is_starting: boolean;
        is_captain: boolean;
      }[];

      await fantasyTeamService.updateFantasyTeam(team.id, { athletes: athletesPayload });
      setShowSuccessModal(true);
    } catch (e) {
      console.error('Failed to update fantasy team', e);
      setSaveError('Failed to update team. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

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
          <p className="font-bold text-xl">My Team</p>
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
            Round
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {leagueRound?.title || '—'}
          </div>
        </div>
      </div>

      {/* Save changes */}
      <div className="mt-3">
        <PrimaryButton
          className="w-full"
          disabled={isSaving || !leagueRound?.is_open}
          onClick={buildPayloadAndSave}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </PrimaryButton>
        {saveError && (
          <div className="mt-2 text-sm text-red-600 dark:text-red-400">{saveError}</div>
        )}
      </div>

      {/* 2x3 grid of slots with player cards */}
      <div className="mt-4 grid gap-4 [grid-template-columns:repeat(2,minmax(0,1fr))]">
        {positions.map((p, index) => {
          const slot = index + 1;
          const athlete = athletesBySlot[slot];
          return (
            <div key={p.position_class} className="flex flex-col w-full min-w-0">
              <div className="w-full min-w-0 aspect-square overflow-hidden p-2 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 flex items-center justify-center">
                {athlete ? (
                  <div className="w-full h-full">
                    <PlayerGameCard
                      player={toIProAthlete(athlete)}
                      className="w-full h-full"
                      blockGlow
                      onClick={() => {
                        const p = toIProAthlete(athlete);
                        setPlayerModalPlayer(p);
                        setShowPlayerModal(true);
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full rounded-lg bg-white/40 dark:bg-gray-900/20">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{p.name}</span>
                  </div>
                )}
              </div>

              {athlete && (
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    className={`${
                      captainAthleteId === athlete.athlete_id
                        ? 'text-xs w-full rounded-lg py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                        : 'text-xs w-full rounded-lg py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    }`}
                    onClick={() => {
                      if (captainAthleteId !== athlete.athlete_id)
                        setCaptainAthleteId(athlete.athlete_id);
                    }}
                    disabled={isSaving || captainAthleteId === athlete.athlete_id}
                  >
                    {captainAthleteId === athlete.athlete_id ? 'Captain' : 'Make Captain'}
                  </button>

                  <button
                    className="text-xs w-full rounded-lg py-1.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50 disabled:opacity-60"
                    onClick={() => {
                      const pos = toPosition(positions[index], index);
                      setSwapState({ open: true, slot, position: pos });
                    }}
                    disabled={isSaving || !leagueRound?.is_open}
                  >
                    Swap
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

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

      {/* Swap selection modal */}
      {swapState.open && swapState.slot != null && swapState.position && (
        <PlayerSelectionModal
          visible={swapState.open}
          selectedPosition={swapState.position}
          players={players}
          remainingBudget={9999}
          selectedPlayers={Object.entries(editableAthletesBySlot)
            .filter(([s]) => Number(s) !== swapState.slot)
            .map(
              ([, a]) => ({ tracking_id: a?.tracking_id || a?.athlete_id }) as AthleteWithTrackingId
            )}
          handlePlayerSelect={(rugbyPlayer: RugbyPlayer) => {
            setEditableAthletesBySlot(prev => {
              const updated = { ...prev };
              const slot = swapState.slot!;
              const current = updated[slot];
              updated[slot] = {
                ...(current || ({} as IFantasyTeamAthlete)),
                athlete_id: rugbyPlayer.tracking_id || rugbyPlayer.id || '',
                tracking_id: rugbyPlayer.tracking_id || rugbyPlayer.id || '',
                player_name: rugbyPlayer.player_name || 'Unknown Player',
                image_url: rugbyPlayer.image_url,
                position: rugbyPlayer.position,
                position_class: rugbyPlayer.position_class,
                team_name: rugbyPlayer.team_name,
                team_logo: rugbyPlayer.team_logo,
                price: rugbyPlayer.price || 0,
                power_rank_rating: rugbyPlayer.power_rank_rating || 0,
                team_id: rugbyPlayer.team_id,
                slot,
                is_captain: (current?.athlete_id || '') === captainAthleteId,
              } as unknown as IFantasyTeamAthlete;
              return updated;
            });
            setSwapState({ open: false, slot: null, position: null });
          }}
          onClose={() => setSwapState({ open: false, slot: null, position: null })}
          roundId={parseInt(String(leagueRound?.id || '0'))}
          roundStart={leagueRound?.start_round ?? undefined}
          roundEnd={leagueRound?.end_round ?? undefined}
          leagueId={String(leagueRound?.official_league_id || '')}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Updated!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your team changes have been saved for {leagueRound?.title}.
              </p>
              <PrimaryButton className="w-full" onClick={() => setShowSuccessModal(false)}>
                Great!
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
