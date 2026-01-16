import { ScopeProvider } from "jotai-scope"
import { playerPickerAtoms } from "../../state/playerPicker/playerPicker"
import { IProAthlete, PositionClass } from "../../types/athletes"
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete"
import { IFantasyAthlete } from "../../types/rugbyPlayer"
import { IFantasyLeagueRound } from "../../types/fantasyLeague"
import { fantasyLeagueAtom } from "../../state/fantasy/fantasyLeague.atoms"
import PlayerPickerHeader from "./PlayerPickerHeader"
import PlayerPickerPlayerList from "./PlayerPickerPlayerList"
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker"
import { formatPosition } from "../../utils/athletes/athleteUtils"
import { useInView } from "react-intersection-observer"
import PlayerPickerFAB from "./PlayerPickerFAB"
import { useCallback, useRef } from "react"
import PlayerPickerDataProvider from "../../providers/PlayerPickerDataProvider"
import { twMerge } from "tailwind-merge"
import { AppColours } from "../../types/constants"
import DialogModal from "../ui/modals/DialogModal"

type Props = {
  playerToBeReplaced?: IProAthlete | IFantasyAthlete | IFantasyTeamAthlete,
  positionPool?: PositionClass,
  onSelectPlayer?: (player: IProAthlete) => void,
  targetLeagueRound?: IFantasyLeagueRound,
  isOpen?: boolean,
  title?: string,
  remainingBudget?: number,
  excludePlayers?: (IProAthlete | IFantasyAthlete | IFantasyTeamAthlete | { tracking_id: string })[],
  onClose?: () => void
}

/** Renders player picker version 2, with improved stability */
export default function PlayerPicker({
  playerToBeReplaced, positionPool,
  onSelectPlayer, targetLeagueRound,
  isOpen, title, remainingBudget,
  excludePlayers, onClose
}: Props) {

  const atoms = [
    playerPickerAtoms.availableTeamsAtom,
    playerPickerAtoms.filterTeamsAtom,
    playerPickerAtoms.relatedGamesAtom,
    playerPickerAtoms.positionPoolAtom,
    playerPickerAtoms.playerToBeReplacedAtom,
    playerPickerAtoms.onSelectPlayerAtom,
    playerPickerAtoms.excludePlayersAtom,
    playerPickerAtoms.searchQueryAtom,
    playerPickerAtoms.viewType,
    fantasyLeagueAtom
  ]

  return (
    <ScopeProvider atoms={atoms} >
      <PlayerPickerDataProvider
        playerToBeReplaced={playerToBeReplaced}
        positionPool={positionPool}
        leagueRound={targetLeagueRound}
        title={title}
        excludePlayers={excludePlayers}
        remainingBudget={remainingBudget}
        onClose={onClose}
      >
        <InnerPlayerPicker
          title={title}
          onClose={onClose}
          onSelect={onSelectPlayer}
          isOpen={isOpen}
        />
      </PlayerPickerDataProvider>
    </ScopeProvider>
  )
}

type InnerPlayerPickerProps = {
  title?: string,
  onClose?: () => void,
  onSelect?: (player: IProAthlete) => void,
  isOpen?: boolean
}

function InnerPlayerPicker({ title, onClose, onSelect, isOpen }: InnerPlayerPickerProps) {

  const { positionPool } = usePlayerPicker();
  const positionName = formatPosition(positionPool);
  const dialogTitle = title ? title : positionName ? `Select a ${positionName} Player` : 'Select A Player';

  const topRef = useRef<HTMLDivElement | null>(null);
  const { ref: inViewRef, inView } = useInView();
  // actual DOM ref

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    topRef.current = node;
    inViewRef(node);
  }, [inViewRef]);

  const handleClickFAB = () => {
    if (!inView && topRef) {
      topRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <DialogModal
      open={isOpen}
      title={dialogTitle}
      onClose={onClose}
      hw="min-h-[100vh] lg:min-h-[95vh] w-full border-none lg:w-[70vh]"
      className="flex flex-col gap-2 relative"
      outerCon={twMerge(
        "no-scrollbar lg:min-h-[95vh] border-none rounded-none lg:rounded-xl lg:dark:bg-slate-800/60",
        AppColours.BACKGROUND
      )}
      ref={setRefs}
    >
      <PlayerPickerHeader />

      <PlayerPickerPlayerList
        onSelect={onSelect}
      />
      <PlayerPickerFAB
        onClick={handleClickFAB}
        show={!inView}
      />
    </DialogModal>
  )
}