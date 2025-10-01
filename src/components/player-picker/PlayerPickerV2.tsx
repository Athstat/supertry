import { ScopeProvider } from "jotai-scope"
import { playerPickerAtoms } from "../../state/playerPicker/playerPicker"
import { IProAthlete, PositionClass } from "../../types/athletes"
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete"
import { IFantasyAthlete } from "../../types/rugbyPlayer"
import DialogModal from "../shared/DialogModal"
import { IFantasyLeagueRound } from "../../types/fantasyLeague"
import { fantasyLeagueAtom } from "../../state/fantasy/fantasyLeague.atoms"
import PlayerPickerHeader from "./PlayerPickerHeader"
import PlayerPickerPlayerList from "./PlayerPickerPlayerList"
import PlayerPickerDataProvider from "./PlayerPickerDataProvider"
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker"
import { formatPosition } from "../../utils/athleteUtils"

type Props = {
  playerToBeReplaced?: IProAthlete | IFantasyAthlete | IFantasyTeamAthlete,
  positionPool?: PositionClass,
  onSelectPlayer?: (player: IProAthlete) => void,
  targetLeagueRound?: IFantasyLeagueRound,
  isOpen?: boolean,
  title?: string,
  remainingBudget?: number,
  excludePlayers?: (IProAthlete | IFantasyAthlete | IFantasyTeamAthlete | {tracking_id: string})[],
  onClose?: () => void
}

/** Renders player picker version 2, with improved stability */
export default function PlayerPickerV2({ 
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
    playerPickerAtoms.maxPlayerPriceAtom,
    fantasyLeagueAtom
  ]
  
  return (
    <ScopeProvider atoms={atoms} >
      <PlayerPickerDataProvider
        playerToBeReplaced={playerToBeReplaced}
        positionPool={positionPool}
        onSelectPlayer={onSelectPlayer}
        leagueRound={targetLeagueRound}
        title={title}
        isOpen={isOpen}
        excludePlayers={excludePlayers}
        remainingBudget={remainingBudget}
        onClose={onClose}
      >
        <InnerPlayerPicker 
          title={title}
          onClose={onClose}
        />
      </PlayerPickerDataProvider>
    </ScopeProvider>
  )
}

type InnerPlayerPickerProps = {
  title?: string,
  onClose?: () => void
}

function InnerPlayerPicker({title, onClose}: InnerPlayerPickerProps) {

  const {positionPool} = usePlayerPicker();
  const positionName = formatPosition(positionPool);
  const dialogTitle = title ? title : positionName ? `Select a ${positionName} Player` : 'Select A Player'; 

  return (
    <DialogModal
      open={true}
      title={dialogTitle}
      onClose={onClose}
      hw="min-h-[95vh] lg:w-[60vh]"
      className="flex flex-col gap-2"
      outerCon=""
    >
      <PlayerPickerHeader />
      
      <PlayerPickerPlayerList />
    </DialogModal>
  )
}