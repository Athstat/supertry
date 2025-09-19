import { Fragment } from 'react/jsx-runtime';
import { FANTASY_TEAM_POSITIONS, MAX_TEAM_BUDGET } from '../../../types/constants';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { PlayerGameCard } from '../../player/PlayerGameCard';
import { useEffect, useMemo, useState } from 'react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { fantasyTeamService } from '../../../services/fantasyTeamService';
import { seasonService } from '../../../services/seasonsService';
import { IProAthlete } from '../../../types/athletes';
import { Position } from '../../../types/position';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import { Loader, Check, X } from 'lucide-react';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import PrimaryButton from '../../shared/buttons/PrimaryButton';
import PlayerSelectionModal from '../../team-creation/PlayerSelectionModal';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';
import { useFantasyLeagueTeam } from './FantasyLeagueTeamProvider';
import { IFantasyLeagueTeamSlot } from '../../../types/fantasyLeagueTeam';
import { useFantasyLeague } from '../../fantasy-league/useFantasyLeague';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import SecondaryText from '../../shared/SecondaryText';
import { twMerge } from 'tailwind-merge';

type Props = {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  team: IFantasyLeagueTeam;
  onTeamUpdated: () => Promise<void>;
  onEditChange?: (isEditing: boolean) => void;
};
/** Renders My Team Edit Grid */
export default function MyTeamEditView({
  team,
  leagueConfig,
  leagueRound,
  onEditChange,
  onTeamUpdated,
}: Props) {

  const {
    slots, removePlayerAtSlot,
    setPlayerAtSlot, teamCaptain,
    totalSpent, setTeamCaptainAtSlot,
    resetToOriginalTeam, originalSlots,
    originalCaptain, setOldPlayerAtSlot
  } = useFantasyLeagueTeam();

  const [playerModalPlayer, setPlayerModalPlayer] = useState<IFantasyTeamAthlete>();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [swapPlayer, setSwapPlayer] = useState<IFantasyTeamAthlete>();

  const handlePlayerClick = (player: IFantasyTeamAthlete) => {
    setPlayerModalPlayer(player);
    setShowProfileModal(true);
  };

  const handleClosePlayerProfileModal = () => {
    setShowProfileModal(false);
    setPlayerModalPlayer(undefined);
  };

  const [players, setPlayers] = useState<IProAthlete[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | undefined>(undefined);

  const [swapState, setSwapState] = useState<{
    open: boolean;
    slot: number | null;
    position?: Position | null;
  }>({ open: false, slot: null, position: null });

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const budgetRemaining = (leagueConfig?.team_budget || MAX_TEAM_BUDGET) - totalSpent;

  const isEditing = useMemo(() => {
    // Captain changed?
    if (teamCaptain?.tracking_id !== originalCaptain?.tracking_id) return true;

    // Any slot player changed?
    for (let i = 1; i <= slots.length; i++) {
      const slot = slots[i];
      const ogSlot = originalSlots[i];

      const orig = ogSlot?.athlete?.athlete_id || undefined;
      const curr = slot?.athlete?.athlete_id || undefined;
      if (orig !== curr) return true;
    }
    return false;

  }, [teamCaptain, originalSlots, originalCaptain, slots]);

  // Cancel: revert to original team state
  const handleCancelEdits = () => {
    resetToOriginalTeam();
  };

  // Load season players for swapping
  useEffect(() => {
    const loadAthletes = async () => {
      if (!leagueRound) return;
      try {
        const athletes = (await seasonService.getSeasonAthletes(leagueRound.season_id))
          .filter(a => {
            return a.power_rank_rating && a.power_rank_rating > 50;
          })
          .sort((a, b) => {
            return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0);
          });

        setPlayers(athletes);
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
      const athletesPayload = slots
        .filter(s => Boolean(s.athlete))
        .map((s) => {
          const slot = s.slotNumber;
          const a = s.athlete;

          if (!a) return undefined;
          return {
            athlete_id: a.athlete_id,
            slot,
            purchase_price: s.purchasePrice || (a as any).price || a.purchase_price || 0,
            is_starting: slot !== 6,
            is_captain: s.isCaptain,
          };
        })
        .filter(Boolean) as {
          athlete_id: string;
          slot: number;
          purchase_price: number;
          is_starting: boolean;
          is_captain: boolean;
        }[];

      console.log('athletesPayload: ', athletesPayload);

      await fantasyTeamService.updateFantasyTeam(team.id, { athletes: athletesPayload });
      await onTeamUpdated();
      setShowSuccessModal(true);
    } catch (e) {
      console.error('Failed to update fantasy team', e);
      setSaveError('Failed to update team. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetCaptain = (slotNumber: number) => {
    setTeamCaptainAtSlot(slotNumber);
  }

  const handleSwapPlayer = (newAthlete: IProAthlete) => {
    if (!swapState || !swapState.slot) return;

    setPlayerAtSlot(swapState.slot, newAthlete);
    setSwapState({ open: false, slot: null, position: null });
  }

  const handleIntiateSwap = (slot: IFantasyLeagueTeamSlot) => {
    const pos = toPosition(slot.position, slot.slotNumber - 1);
    setSwapState({ open: true, slot: slot.slotNumber, position: pos });

    if (slot.athlete) {
      setSwapPlayer(slot.athlete);
    }
  }

  const handleCancelSwap = () => {
    setSwapPlayer(undefined);

    setSwapState({
      open: false,
      slot: null,
      position: undefined
    });

  }

  const handleAddPlayerOnEmptySlot = (slot: IFantasyLeagueTeamSlot) => {
    // Set slot state
    const pos = toPosition(slot.position, slot.slotNumber - 1);
    setSwapState({
      open: true,
      slot: slot.slotNumber,
      position: pos
    })

  }

  return (
    <Fragment>
      {isEditing && (
        <div className="mt-3 flex-col gap-2  relative z-[50]">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancelEdits}
              disabled={isSaving}
              className="w-1/2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200 px-4 py-2 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
            >
              Cancel
            </button>
            <PrimaryButton
              className="w-1/2"
              disabled={isSaving || !leagueRound?.is_open}
              onClick={buildPayloadAndSave}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </div>
          {saveError && (
            <div className="mt-2 text-sm text-red-600 dark:text-red-400">{saveError}</div>
          )}
        </div>
      )}

      <div className="mt-4 grid gap-4 [grid-template-columns:repeat(2,minmax(0,1fr))]">

        {slots.map((s) => {
          return (
            <EditableTeamSlotItem
              key={s.slotNumber}
              slot={s}
              onPlayerClick={handlePlayerClick}
              onInitiateSwap={handleIntiateSwap}
              onAddPlayerToEmptySlot={handleAddPlayerOnEmptySlot}
            />
          );
        })}
      </div>



      {/* Player profile modal */}
      {
        playerModalPlayer && (
          <PlayerProfileModal
            player={playerModalPlayer}
            isOpen={showProfileModal}
            onClose={handleClosePlayerProfileModal}
          />
        )
      }

      {/* Swap selection modal */}
      {
        swapState.open && swapState.slot != null && swapState.position && (
          <PlayerSelectionModal
            visible={swapState.open}
            selectedPosition={swapState.position}
            players={players.filter(p => p.tracking_id !== swapPlayer?.tracking_id)}
            remainingBudget={budgetRemaining + (swapPlayer?.purchase_price || 0)}
            selectedPlayers={
              slots
                .filter(s => Boolean(s.athlete))
                .map((s) => {
                  return { tracking_id: s.athlete?.tracking_id ?? '' }
                })
            }

            handlePlayerSelect={handleSwapPlayer}
            onClose={handleCancelSwap}
            roundId={parseInt(String(leagueRound?.id || '0'))}
            roundStart={leagueRound?.start_round ?? undefined}
            roundEnd={leagueRound?.end_round ?? undefined}
            leagueId={String(leagueRound?.official_league_id || '')}
          />
        )
      }

      {/* Loading Modal */}
      {
        isSaving && !showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full text-primary-500 dark:text-primary-400">
                  <Loader className="w-10 h-10 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Saving</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please wait while we save your team...
                </p>
              </div>
            </div>
          </div>
        )
      }

      {/* Success Modal */}
      {
        showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                  <Check size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Updated!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your team changes have been saved for {leagueRound?.title}
                </p>
                <PrimaryButton
                  className="w-full"
                  onClick={() => {
                    setShowSuccessModal(false);
                    if (onTeamUpdated) {
                      onTeamUpdated();
                    }
                  }}
                >
                  Great!
                </PrimaryButton>
              </div>
            </div>
          </div>
        )
      }
    </Fragment >
  );
}

type SlotProps = {
  slot: IFantasyLeagueTeamSlot,
  onPlayerClick?: (player: IFantasyTeamAthlete) => void;
  disabled?: boolean;
  onInitiateSwap?: (slot: IFantasyLeagueTeamSlot) => void;
  onAddPlayerToEmptySlot?: (slot: IFantasyLeagueTeamSlot) => void;
}

function EditableTeamSlotItem({ slot, onPlayerClick, disabled, onInitiateSwap, onAddPlayerToEmptySlot }: SlotProps) {

  const { currentRound } = useFantasyLeagueGroup();
  const { setTeamCaptainAtSlot, removePlayerAtSlot } = useFantasyLeagueTeam();
  const athlete = slot.athlete;

  const isCurrPlayerCaptain = slot.isCaptain;

  const handlePlayerClick = () => {
    if (onPlayerClick && slot.athlete) {
      onPlayerClick(slot.athlete);
    }
  }

  const handleSetCaptain = () => {
    setTeamCaptainAtSlot(slot.slotNumber);
  }

  const handleInitiateSwap = () => {
    if (onInitiateSwap) {
      onInitiateSwap(slot);
    }
  }

  const handleClearSlot = () => {
    removePlayerAtSlot(slot.slotNumber);
  }

  const cannotSelectCaptain = disabled || isCurrPlayerCaptain;
  const isLocked = currentRound && isLeagueRoundLocked(currentRound);

  return (
    <Fragment>

      <div key={athlete?.tracking_id} className="flex flex-col w-full min-w-0 p-2">
        <div className="w-full min-w-0 h-60 flex items-center justify-center bg-transparent">
          {athlete ? (
            <div className="w-full h-full flex flex-col items-center justify-center">

              <div className=' flex w-full flex-row items-center justify-between' >
                <SecondaryText>{slot.position.name}</SecondaryText>
                <div>
                  <button
                    onClick={handleClearSlot}
                    className='dark:bg-slate-700/60 bg-slate-200 hover:dark:bg-slate-700 w-6 h-6 rounded-md flex flex-col items-center justify-center'
                  >
                    <X className='w-4 h-4 text-slate-700 dark:text-white' />
                  </button>
                </div>
              </div>

              <PlayerGameCard
                key={athlete.tracking_id}
                player={athlete}
                className="mx-auto"
                blockGlow
                onClick={handlePlayerClick}
                detailsClassName="pl-6 pr-6 pb-7"
                priceClassName="top-12 left-6"
                teamLogoClassName="top-4 right-2"
              />
            </div>
          ) : (
            <EmptySlotCard
              slot={slot}
              onClickSlot={onAddPlayerToEmptySlot}
            />
          )}
        </div>

        {athlete && (
          <div className="mt-4 flex flex-col gap-2 z-50">
            <button
              className={`${isCurrPlayerCaptain
                ? 'text-xs w-full rounded-lg py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700'
                : `text-xs w-full rounded-lg py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700 ${isLocked ? '' : 'hover:bg-blue-100 dark:hover:bg-blue-900/50'}`
                }`}
              onClick={handleSetCaptain}
              disabled={cannotSelectCaptain}
            >
              {isCurrPlayerCaptain ? 'Captain' : 'Make Captain'}
            </button>

            <button
              className={`text-xs w-full rounded-lg py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 ${isLocked ? '' : 'hover:bg-purple-100 dark:hover:bg-purple-900/50 disabled:opacity-60'}`}
              onClick={handleInitiateSwap}
              disabled={disabled}
            >
              Swap
            </button>
          </div>
        )}

        {!athlete && (
          <div className="mt-4 flex flex-col gap-2 z-50">
            <button
              className={`text-xs w-full rounded-lg py-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700 ${isLocked ? '' : 'hover:bg-purple-100 dark:hover:bg-purple-900/50 disabled:opacity-60'}`}
              onClick={() => {
                if (onAddPlayerToEmptySlot) {
                  onAddPlayerToEmptySlot(slot)
                }
              }}
              disabled={disabled}
            >
              Add Player
            </button>
          </div>
        )}
      </div>

    </Fragment>
  )
}

type EmptySlotCardProps = {
  slot: IFantasyLeagueTeamSlot,
  onClickSlot?: (slot: IFantasyLeagueTeamSlot) => void
}

function EmptySlotCard({ slot, onClickSlot }: EmptySlotCardProps) {

  const handleClickSlot = () => {
    if (onClickSlot) {
      onClickSlot(slot);
    }
  }

  return (
    <div
      onClick={handleClickSlot}
      className={twMerge(
        "flex flex-col cursor-pointer hover:dark:bg-slate-800/40 dark:bg-slate-800/20 rounded-xl border-4 border-slate-500/30 items-center justify-center border-dotted w-full h-full",
        "bg-white hover:bg-gray-100"
      )}
    >
      <span className="text-3xl">+</span>
      <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{slot.position.name}</span>
    </div>
  )
}

// onClick={() => {
//   const pos = toPosition(positions[index], index);
//   setSwapState({ open: true, slot: slotNumber, position: pos });

//   if (s.athlete) {
//     setSwapPlayer(s.athlete);
//   }
// }}