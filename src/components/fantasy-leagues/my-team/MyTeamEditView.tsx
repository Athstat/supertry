import { Fragment } from 'react/jsx-runtime';
import { MAX_TEAM_BUDGET } from '../../../types/constants';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { useEffect, useMemo, useState } from 'react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { fantasyTeamService } from '../../../services/fantasyTeamService';
import { seasonService } from '../../../services/seasonsService';
import { IProAthlete } from '../../../types/athletes';
import { Position } from '../../../types/position';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import { Loader, Check } from 'lucide-react';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import PrimaryButton from '../../shared/buttons/PrimaryButton';
import PlayerSelectionModal from '../../team-creation/PlayerSelectionModal';
import { useFantasyLeagueTeam } from './FantasyLeagueTeamProvider';
import { IFantasyLeagueTeamSlot } from '../../../types/fantasyLeagueTeam';
import { EditableTeamSlotItem } from './EditableTeamSlotItem';

type Props = {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  team: IFantasyLeagueTeam;
  onTeamUpdated: () => Promise<void>;
  onEditChange?: (isEditing: boolean) => void;
};
/** Renders My Team Edit Grid */
export default function MyTeamEditView({ team, leagueConfig,leagueRound, onTeamUpdated }: Props) {

  const {
    slots,
    setPlayerAtSlot, teamCaptain, totalSpent,
    resetToOriginalTeam, originalSlots, originalCaptain, 
    changesDetected, isTeamFull
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
    return changesDetected;
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

  const handleCompleteSwapPlayer = (newAthlete: IProAthlete) => {
    
    console.log("About to swap player", swapState);
    
    if (!swapState || swapState.slot === null || !swapPlayer?.slot === undefined) return;

    console.log("Yey, so we passed the test bro");
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
    });

    setSwapPlayer(undefined);
  }

  // const handleClearSlot = (slot: IFantasyLeagueTeamSlot) => {
  //   const {playerRemoved} = removePlayerAtSlot(slot.slotNumber);
  //   if (playerRemoved) {
  //     setSwapState({

  //     })
  //   }
  // }

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
              disabled={isSaving || !leagueRound?.is_open || !isTeamFull}
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

            handlePlayerSelect={handleCompleteSwapPlayer}
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