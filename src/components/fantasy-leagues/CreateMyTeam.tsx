import { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import { Player } from '../../types/player';
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
import { leagueService } from '../../services/leagueService';
import { authService } from '../../services/authService';
import { ICreateFantasyTeamAthleteItem } from '../../types/fantasyTeamAthlete';
import { ArrowLeft, Check, Users } from 'lucide-react';
import { Toast } from '../ui/Toast';

export default function CreateMyTeam({
  leagueRound,
  onTeamCreated,
  onBack,
}: {
  leagueRound?: IFantasyLeagueRound;
  onTeamCreated?: (team: IFantasyLeagueTeam) => void;
  onBack?: () => void;
}) {
  const [selectedPlayers, setSelectedPlayers] = useState<Record<string, Player>>({});
  const [activePosition, setActivePosition] = useState<Position | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [players, setPlayers] = useState<RugbyPlayer[]>([]);
  const [captainId, setCaptainId] = useState<string | null>(null);
  const [playerModalPlayer, setPlayerModalPlayer] = useState<IProAthlete | undefined>(undefined);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
          // Required fields in RugbyPlayer
          scoring: 0,
          defence: 0,
          attacking: 0,
        }));
        setPlayers(mapped);
      } catch (e) {
        console.error('Failed to load athletes for season ', leagueId, e);
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

  const toIProAthlete = (p: Player): IProAthlete => ({
    tracking_id: p.id,
    player_name: p.name,
    power_rank_rating: p.power_rank_rating,
    image_url: p.image_url,
    position: p.position,
    // Defaults/fallbacks for required fields
    gender: 'M',
    form: 'NEUTRAL',
    team_id: '',
    team: {
      athstat_id: '',
      source_id: '',
      athstat_name: p.team,
      image_url: p.team.image_url,
      sport: '',
      organization: '',
    },
  });

  const handleSave = async () => {
    if (!leagueRound) {
      showToast('No league round selected');
      return;
    }

    //if the user hasn't selected a captain then show them a toast asking them to select one
    if (!captainId) {
      showToast('Please select a captain');
      return;
    }

    try {
      setIsSaving(true);
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
            athlete_id: selected.id,
            purchase_price: selected.price || 0,
            purchase_date: new Date(),
            is_starting: !isSuperSub,
            slot: index + 1,
            is_super_sub: isSuperSub,
            is_captain: selected.id === captainId || false,
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
      // If parent wants to handle success (e.g., show modal and switch tabScene), notify it
      if (onTeamCreated) {
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
        onTeamCreated(createdTeam);
      } else {
        // Fall back to local success modal
        setShowSuccessModal(true);
      }
    } catch (e) {
      console.error('Failed to save team', e);
      setSaveError('Failed to save team. Please try again.');
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
          <p className="font-bold text-xl">Create Team</p>
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
            {240 - Object.values(selectedPlayers).reduce((sum, p) => sum + p.price, 0)}/240
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
                    setPlayerModalPlayer(toIProAthlete(selected));
                    setShowPlayerModal(true);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="aspect-square overflow-hidden p-2 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-gray-800/40 text-gray-400 dark:text-gray-500 flex items-center justify-center"
              >
                {selected ? (
                  <PlayerGameCard
                    player={toIProAthlete(selected)}
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
                    className="text-xs w-full rounded-lg py-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700 hover:bg-red-100 dark:hover:bg-red-900/50"
                    onClick={() => {
                      setSelectedPlayers(prev => {
                        const copy = { ...prev } as Record<string, Player>;
                        delete copy[p.name];
                        return copy;
                      });
                      if (captainId === selected.id) setCaptainId(null);
                    }}
                  >
                    Remove
                  </button>

                  <button
                    className={`${
                      captainId === selected.id
                        ? 'text-xs w-full rounded-lg py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                        : 'text-xs w-full rounded-lg py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                    }`}
                    onClick={() => {
                      if (captainId !== selected.id) setCaptainId(selected.id);
                    }}
                    disabled={captainId === selected.id}
                  >
                    {captainId === selected.id ? 'Captain' : 'Set as Captain'}
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
            240 - Object.values(selectedPlayers).reduce((sum, p) => sum + (p.price || 0), 0)
          }
          selectedPlayers={Object.values(selectedPlayers).map(p => ({ tracking_id: p.id }))}
          handlePlayerSelect={rugbyPlayer => {
            const mapped: Player = {
              id: rugbyPlayer.tracking_id || rugbyPlayer.id || Math.random().toString(),
              name: rugbyPlayer.player_name || 'Unknown Player',
              team: rugbyPlayer.team_name || 'Unknown Team',
              position: activePosition.name,
              price: rugbyPlayer.price || 0,
              points: rugbyPlayer.power_rank_rating || 0,
              image_url: rugbyPlayer.image_url,
              power_rank_rating: rugbyPlayer.power_rank_rating,
            };
            setSelectedPlayers(prev => ({ ...prev, [activePosition.name]: mapped }));
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Submitted!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your team has been successfully submitted to {leagueRound?.title}.
              </p>
              <PrimaryButton className="w-full" onClick={() => setShowSuccessModal(false)}>
                Let's Go!
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
