import DialogModal from "../../shared/DialogModal";
import PlayersCompareItem from "./PlayerCompareItem";
import { useAtomValue, useSetAtom } from "jotai";
import { comparePlayersAtom, comparePlayersAtomGroup, comparePlayersStatsAtom, comparePlayersStarRatingsAtom } from "../../../state/comparePlayers.atoms";
import EmptyPlayerCompareSlot from "./EmptyPlayerCompareSlot";
import { twMerge } from "tailwind-merge";
import { usePlayerCompareActions } from "../../../hooks/usePlayerCompare";
import { useImagePreloader } from "../../../hooks/web/useImagePreloader";
import { useEffect } from "react";
import { analytics } from "../../../services/analytics/anayticsService";

export default function PlayerCompareModal() {

  const selectedPlayers = useAtomValue(comparePlayersAtom);
  const open = useAtomValue(comparePlayersAtomGroup.isCompareModeModal);
  const setComparePlayersStats = useSetAtom(comparePlayersStatsAtom);
  const setComparePlayersStarRatings = useSetAtom(comparePlayersStarRatingsAtom);

  const { closeCompareModal } = usePlayerCompareActions();

  // Clear stats atoms when modal opens to ensure fresh comparison
  useEffect(() => {
    if (open) {
      setComparePlayersStats([]);
      setComparePlayersStarRatings([]);
    }
  }, [open, setComparePlayersStats, setComparePlayersStarRatings]);

  useEffect(() => {
    if (selectedPlayers.length > 0) {
      analytics.trackComparedPlayers(selectedPlayers);
    }
  }, [selectedPlayers]);

  // Preload images when modal is open
  useImagePreloader({ players: selectedPlayers, enabled: open });

  const playerLen = selectedPlayers.length;
  const title = `Comparing ${playerLen} player${playerLen === 1 ? '' : 's'}`;

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
