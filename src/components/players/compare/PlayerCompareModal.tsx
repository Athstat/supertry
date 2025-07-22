import DialogModal from "../../shared/DialogModal";
import { IProAthlete } from "../../../types/athletes";
import PlayersCompareItem from "./PlayerCompareItem";
import { useAtom } from "jotai";
import { comparePlayersAtom, comparePlayersStarRatingsAtom, comparePlayersStatsAtom, showComparePlayerInfo } from "../../../state/comparePlayers.atoms";
import { ScopeProvider } from "jotai-scope";
import PlayerCompareProvider from "./PlayerCompareProvider";
import EmptyPlayerCompareSlot from "./EmptyPlayerCompareSlot";
import { twMerge } from "tailwind-merge";
import { useCallback } from "react";

type Props = {
  selectedPlayers: IProAthlete[];
  open?: boolean;
  onCloseCallback?: (players: IProAthlete[]) => void;
};

export default function PlayerCompareModal({ selectedPlayers, open, onCloseCallback }: Props) {
  const atoms = [
    comparePlayersAtom, comparePlayersStatsAtom,
    comparePlayersStarRatingsAtom, showComparePlayerInfo
  ]

  return (
    <ScopeProvider atoms={atoms}>
      <PlayerCompareProvider
        selectedPlayers={selectedPlayers}
      >

        <Content
          onCloseCallback={onCloseCallback}
          open={open}
        />

      </PlayerCompareProvider>
    </ScopeProvider>
  )
}

type ContentProps = {
  open?: boolean;
  onCloseCallback?: (player: IProAthlete[]) => void;
}

function Content({ open, onCloseCallback }: ContentProps) {

  const [selectedPlayers, setSelectedPlayers] = useAtom(comparePlayersAtom);

  const playerLen = selectedPlayers.length;
  let title = `Comparing ${playerLen} player${playerLen === 1 ? '' : 's'}`;

  const handleOnClose = useCallback(() => {
    if (onCloseCallback) {
      onCloseCallback(selectedPlayers);
    }
  }, [selectedPlayers]);

  const onRemove = useCallback((player: IProAthlete) => {
    setSelectedPlayers(prev => {
      return prev.filter((p) => {
        return p.tracking_id !== player.tracking_id;
      })
    })
  }, [selectedPlayers]);

  if (open === false) return;

  return (
    <DialogModal

      open={open}
      title={title}
      onClose={handleOnClose}
      hw="w-[98%] lg:w-[85%] max-h-[98%] min-h-[98%] lg:max-h-[90%] lg:min-h-[90%]"
      outerCon="p-3 lg:p-6"
    >

      <div className={twMerge(
        "flex flex-row gap-2 overflow-x-auto"
      )} >

        {selectedPlayers.map((player) => {
          return <PlayersCompareItem
            player={player}
            key={player.tracking_id}
            onRemove={onRemove}
          />
        })}

        <EmptyPlayerCompareSlot />

      </div>
    </DialogModal>
  );
}