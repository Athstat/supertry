import DialogModal from "../../shared/DialogModal";
import { IProAthlete } from "../../../types/athletes";
import PlayersCompareItem from "./PlayerCompareItem";
import { useAtomValue } from "jotai";
import { comparePlayersAtom, comparePlayersStarRatingsAtom, comparePlayersStatsAtom, showComparePlayerInfo } from "../../../state/comparePlayers.atoms";
import { ScopeProvider } from "jotai-scope";
import PlayerCompareDataProvider from "./PlayerCompareDataProvider";
import EmptyPlayerCompareSlot from "./EmptyPlayerCompareSlot";
import { twMerge } from "tailwind-merge";

type Props = {
  selectedPlayers: IProAthlete[];
  open?: boolean;
  onClose?: () => void;
  onRemove: (player: IProAthlete) => void;
};

export default function PlayerCompareModal({ selectedPlayers, open, onClose, onRemove }: Props) {
  const atoms = [
    comparePlayersAtom, comparePlayersStatsAtom,
    comparePlayersStarRatingsAtom, showComparePlayerInfo
  ]

  return (
    <ScopeProvider atoms={atoms}>
      <PlayerCompareDataProvider
        selectedPlayers={selectedPlayers}
      >

        <Content
          onRemove={onRemove}
          onClose={onClose}
          open={open}
        />

      </PlayerCompareDataProvider>
    </ScopeProvider>
  )
}

type ContentProps = {
  open?: boolean;
  onClose?: () => void;
  onRemove: (player: IProAthlete) => void;
}

function Content({ onRemove, onClose, open }: ContentProps) {

  const selectedPlayers = useAtomValue(comparePlayersAtom);

  if (open === false || selectedPlayers.length < 2) return;

  const player1 = selectedPlayers[0];
  const player2 = selectedPlayers[1];
  let title = `Comparing ${player1.player_name} and ${player2.player_name}`;

  return (
    <DialogModal

      open={open}
      title={title}
      onClose={onClose}
      hw="w-[98%] lg:w-[45%] max-h-[98%]"
      outerCon="p-3"
    >

      <div className={twMerge(
        "flex flex-row gap-2 overflow-x-auto"
      )} >

        {selectedPlayers.map((player) => {
          return <PlayersCompareItem
            player={player}
            onRemove={onRemove}
          />
        })}

        <EmptyPlayerCompareSlot />

      </div>
    </DialogModal>
  );
}