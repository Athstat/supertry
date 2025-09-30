import { ScopeProvider } from "jotai-scope"
import { playerPickerAtoms } from "../../state/playerPicker/playerPicker"
import { IProAthlete, PositionClass } from "../../types/athletes"
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete"
import { IFantasyAthlete } from "../../types/rugbyPlayer"
import DialogModal from "../shared/DialogModal"
import { useSetAtom } from "jotai"
import { IFantasyLeagueRound } from "../../types/fantasyLeague"
import { fantasyLeagueAtom } from "../../state/fantasy/fantasyLeague.atoms"
import { useEffect } from "react"

type Props = {
  playerToBeReplaced?: IProAthlete | IFantasyAthlete | IFantasyTeamAthlete,
  positionPool?: PositionClass,
  onSelectPlayer?: (player: IProAthlete) => void,
  targetLeagueRound?: IFantasyLeagueRound
}

/** Renders player picker version 2, with improved stability */
export default function PlayerPickerV2({ playerToBeReplaced, positionPool, onSelectPlayer, targetLeagueRound}: Props) {
  
  const atoms = [
    playerPickerAtoms.availableTeamsAtom,
    playerPickerAtoms.filterTeamsAtom,
    playerPickerAtoms.relatedGamesAtom,
    playerPickerAtoms.positionPoolAtom,
    playerPickerAtoms.playerToBeReplacedAtom,
    playerPickerAtoms.onSelectPlayerAtom,
    fantasyLeagueAtom
  ]
  
  return (
    <ScopeProvider atoms={atoms} >
      <InnerPlayerPicker 
        playerToBeReplaced={playerToBeReplaced}
        positionPool={positionPool}
        onSelectPlayer={onSelectPlayer}
        targetLeagueRound={targetLeagueRound}
      />
    </ScopeProvider>
  )
}

function InnerPlayerPicker({playerToBeReplaced, positionPool, targetLeagueRound, onSelectPlayer}: Props) {
  
  const setTargetRound = useSetAtom(fantasyLeagueAtom);
  const setPositionPool = useSetAtom(playerPickerAtoms.positionPoolAtom);
  const setPlayerToBeReplaced = useSetAtom(playerPickerAtoms.playerToBeReplacedAtom);
  const setOnSelectPlayer = useSetAtom(playerPickerAtoms.onSelectPlayerAtom)

  useEffect(() => {
    if (targetLeagueRound) {
      setTargetRound(targetLeagueRound);
    }
  }, [targetLeagueRound, setTargetRound]);

  useEffect(() => {
    if (positionPool) {
      setPositionPool(positionPool);
    }
  }, [positionPool, setPositionPool]);

  useEffect(() => {
    if (playerToBeReplaced) {
      setPlayerToBeReplaced(playerToBeReplaced);
    }
  }, [playerToBeReplaced, setPlayerToBeReplaced]);
  
  useEffect(() => {
    if (onSelectPlayer) {
      setOnSelectPlayer(onSelectPlayer);
    }
  }, [setOnSelectPlayer, onSelectPlayer]);

  return (
    <DialogModal>

    </DialogModal>
  )
}