import { Lock, X } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils";
import { PlayerGameCard } from "../../player/PlayerGameCard";
import SecondaryText from "../../shared/SecondaryText";
import { useFantasyLeagueTeam } from "../../providers/fantasy_teams/FantasyTeamProvider";
import { fantasyAnalytics } from "../../../services/analytics/fantasyAnalytics";

type SlotProps = {
  slot: IFantasyLeagueTeamSlot,
  onPlayerClick?: (player: IFantasyTeamAthlete) => void;
  disabled?: boolean;
  onInitiateSwap?: (slot: IFantasyLeagueTeamSlot) => void;
  onAddPlayerToEmptySlot?: (slot: IFantasyLeagueTeamSlot) => void;
}

/** Renders an editable fantasy league team slot */
export function EditableTeamSlotItem({ slot, onPlayerClick, disabled, onInitiateSwap, onAddPlayerToEmptySlot }: SlotProps) {

  const { currentRound } = useFantasyLeagueGroup();
  const { setTeamCaptainAtSlot, removePlayerAtSlot } = useFantasyLeagueTeam();
  const athlete = slot.athlete;

  const isCurrPlayerCaptain = slot.isCaptain;
  const isLocked = currentRound && isLeagueRoundLocked(currentRound);

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
    if (isLocked) {
      return;
    }
    removePlayerAtSlot(slot.slotNumber);

    fantasyAnalytics.trackClearedTeamSlot();
  }

  const cannotSelectCaptain = disabled || isCurrPlayerCaptain;

  return (
    <Fragment>

      <div key={athlete?.tracking_id} className="flex flex-col w-full min-w-0 p-2">
        <div className="w-full min-w-0 h-60 flex items-center justify-center bg-transparent">
          {athlete ? (
            <div className="w-full h-full flex flex-col items-center justify-center">

              {<div className={twMerge(
                'flex w-full flex-row items-center justify-between'
              )} >
                <SecondaryText>{slot.position.name}</SecondaryText>
                <div>
                  <button
                    onClick={handleClearSlot}
                    className={twMerge(
                      'dark:bg-slate-700/60 bg-slate-200 hover:dark:bg-slate-700 w-6 h-6 rounded-md flex flex-col items-center justify-center',
                      isLocked && 'opacity-25'
                    )}
                  >
                    {!isLocked && <X className='w-4 h-4 text-slate-700 dark:text-white' />}
                    {isLocked && <Lock className='w-4 h-4 text-slate-700 dark:text-white' />}
                  </button>
                </div>
              </div>}

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
            <EmptyFantasyTeamSlotCard
              slot={slot}
              onClickSlot={onAddPlayerToEmptySlot}
            />
          )}
        </div>

        {athlete && !isLocked && (
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

        {!athlete && !isLocked && (
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
  onClickSlot?: (slot: IFantasyLeagueTeamSlot) => void,
  className?: string
}

export function EmptyFantasyTeamSlotCard({ slot, onClickSlot, className }: EmptySlotCardProps) {

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
        "bg-white hover:bg-gray-100",
        className
      )}
    >
      <span className="text-3xl">+</span>
      <span className="mt-2 text-xs text-gray-500 dark:text-gray-400">{slot.position.name}</span>
    </div>
  )
}

export function EmptyPlayerCard({ slot, onClickSlot, className }: EmptySlotCardProps) {

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
        "bg-white hover:bg-gray-100",
        'min-w-[160px] max-w-[160px]  cursor-pointer max-h-[250px] ',
        'lg:min-w-[200px] lg:max-w-[200px]',
        'flex items-center justify-center relative text-white dark:text-white',
        className
      )}
    >
      <span className="mt-2 text-base text-gray-500 dark:text-gray-400">{slot.position.name}</span>
      <SecondaryText className="text-xs">Empty</SecondaryText>
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