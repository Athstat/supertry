import DialogModal from "../../shared/DialogModal";
import { IProAthlete } from "../../../types/athletes";
import PlayersCompareItem from "./PlayerCompareItem";
import { useAtom } from "jotai";
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

function Content({ onClose, open }: ContentProps) {

  const [selectedPlayers, setSelectedPlayers] = useAtom(comparePlayersAtom);
  
  const onRemovePlayer = (player: IProAthlete) => {
    setSelectedPlayers(prev => {
      return prev.filter(a => a.tracking_id !== player.tracking_id);
    });
  }

  if (open === false) return;

  const playerLen = selectedPlayers.length;
  let title = `Comparing ${playerLen} player${playerLen === 1 ? '' : 's'}`;

  return (
    <DialogModal

      open={open}
      title={title}
      onClose={onClose}
      hw="w-[98%] lg:w-[85%] max-h-[98%] min-h-[98%] lg:max-h-[90%] lg:min-h-[90%]"
      outerCon="p-3 lg:p-6"
    >

      <div className={twMerge(
        "flex flex-row gap-2 overflow-x-auto"
      )} >

        {selectedPlayers.map((player) => {
          return <PlayersCompareItem
            player={player}
            onRemove={onRemovePlayer}
            key={player.tracking_id}
          />
        })}

        <EmptyPlayerCompareSlot />

      </div>
    </DialogModal>
  );
}