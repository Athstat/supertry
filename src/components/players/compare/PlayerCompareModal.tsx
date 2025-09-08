import DialogModal from "../../shared/DialogModal";
import PlayersCompareItem from "./PlayerCompareItem";
import { useAtomValue } from "jotai";
import { comparePlayersAtom, comparePlayersAtomGroup } from "../../../state/comparePlayers.atoms";
import EmptyPlayerCompareSlot from "./EmptyPlayerCompareSlot";
import { twMerge } from "tailwind-merge";
import { usePlayerCompareActions } from "../../../hooks/usePlayerCompare";
import { useImagePreloader } from "../../../hooks/useImagePreloader";
import { useEffect } from "react";
import { analytics } from "../../../services/analytics/anayticsService";

type Props = {
}

export default function PlayerCompareModal({}: Props) {

  const selectedPlayers = useAtomValue(comparePlayersAtom);
  const open = useAtomValue(comparePlayersAtomGroup.isCompareModeModal);

  const  {closeCompareModal} = usePlayerCompareActions();

  useEffect(() => {
    analytics.trackComparedPlayers(selectedPlayers);
  }, [selectedPlayers]);

  // Preload images when modal is open
  useImagePreloader({ players: selectedPlayers, enabled: open });

  const playerLen = selectedPlayers.length;
  let title = `Comparing ${playerLen} player${playerLen === 1 ? '' : 's'}`;
  
  if (open === false) return;

  return (
    <DialogModal
      open={open}
      title={title}
      onClose={closeCompareModal}
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
          />
        })}

        <EmptyPlayerCompareSlot />

      </div>
    </DialogModal>
  );
}
