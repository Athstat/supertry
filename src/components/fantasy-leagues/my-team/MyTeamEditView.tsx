import { Fragment } from 'react/jsx-runtime';
import { MAX_TEAM_BUDGET } from '../../../types/constants';
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete';
import { useEffect, useState } from 'react';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../../types/fantasyLeague';
import { IProAthlete, PositionClass } from '../../../types/athletes';
import { Position } from '../../../types/position';
import { IGamesLeagueConfig } from '../../../types/leagueConfig';
import PlayerProfileModal from '../../player/PlayerProfileModal';
import { useFantasyLeagueTeam } from './FantasyLeagueTeamProvider';
import { IFantasyLeagueTeamSlot } from '../../../types/fantasyLeagueTeam';
import { EditableTeamSlotItem } from './EditableTeamSlotItem';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';
import WarningCard from '../../shared/WarningCard';
import { fantasyAnalytics } from '../../../services/analytics/fantasyAnalytics';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import PlayerPickerV2 from '../../player-picker/PlayerPickerV2';

type Props = {
  leagueRound?: IFantasyLeagueRound;
  leagueConfig?: IGamesLeagueConfig;
  team: IFantasyLeagueTeam;
  onEditChange?: (isEditing: boolean) => void;
};
/** Renders My Team Edit Grid */
export default function MyTeamEditView({ leagueConfig,leagueRound }: Props) {

  const {
    slots,
    setPlayerAtSlot, totalSpent,
    
  } = useFantasyLeagueTeam();

  const {league} = useFantasyLeagueGroup();

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

  const [swapState, setSwapState] = useState<{
    open: boolean;
    slot: number | null;
    position?: Position | null;
  }>({ open: false, slot: null, position: null });

  const budgetRemaining = (leagueConfig?.team_budget || MAX_TEAM_BUDGET) - totalSpent;
  const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);

  useEffect(() => {
    fantasyAnalytics.trackVisitedEditTeamTab(
      league?.id,
      leagueRound?.id
    );
  }, []);

  // Load season players for swapping
  // useEffect(() => {
  //   const loadAthletes = async () => {
  //     if (!leagueRound) return;
  //     try {
  //       const athletes = (await seasonService.getSeasonAthletes(leagueRound.season_id))
  //         .filter(a => {
  //           return a.power_rank_rating && a.power_rank_rating > 50;
  //         })
  //         .sort((a, b) => {
  //           return (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0);
  //         });

  //       setPlayers(athletes);
  //     } catch (e) {
  //       console.error('Failed to load athletes for season', e);
  //     }
  //   };
  //   loadAthletes();
  // }, [leagueRound]);

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

  const handleCompleteSwapPlayer = (newAthlete: IProAthlete) => {
    
    console.log("About to swap player", swapState);
    
    if (!swapState || swapState.slot === null || swapPlayer?.slot === undefined) return;

    console.log("Yey, so we passed the test bro");
    setPlayerAtSlot(swapState.slot, newAthlete);
    setSwapState({ open: false, slot: null, position: null });

    fantasyAnalytics.trackUsedSwapPlayerFeature();
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
      
      {isLocked && leagueRound && <WarningCard className='text-sm' >
        <p>
          Team selection for <strong>{leagueRound.title}</strong> has been locked. You can
          no longer make changes to your lineup after the deadline has passed
        </p>
      </WarningCard>}

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
      {/* {
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
      } */}

      {
         (
          <PlayerPickerV2
            isOpen={swapState.open && swapState.slot != null && Boolean(swapState.position)}
            positionPool={swapState?.position?.positionClass as PositionClass}
            remainingBudget={budgetRemaining + (swapPlayer?.purchase_price || 0)}
            excludePlayers={
              slots
                .filter(s => Boolean(s.athlete))
                .map((s) => {
                  return { tracking_id: s.athlete?.tracking_id ?? '' }
                })
            }
            onSelectPlayer={handleCompleteSwapPlayer}
            onClose={handleCancelSwap}
            targetLeagueRound={leagueRound}
            playerToBeReplaced={swapPlayer}
          />
        )
      }

    </Fragment >
  );
}