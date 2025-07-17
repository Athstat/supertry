import DialogModal from "../../shared/DialogModal";
import { IProAthlete } from "../../../types/athletes";
import PlayersCompareItem from "./PlayerCompareItem";

type Props = {
  selectedPlayers: IProAthlete[];
  open?: boolean;
  onClose?: () => void;
  onRemove: (player: IProAthlete) => void;
};

export default function PlayerCompareModal({ selectedPlayers, open, onClose, onRemove }: Props) {
  if (open === false || selectedPlayers.length < 2) return;

  const player1 = selectedPlayers[0];
  const player2 = selectedPlayers[1];
  let title = `Comparing ${player1.player_name} and ${player2.player_name}`;

  return (
    <DialogModal

      open={open}
      title={title}
      onClose={onClose}
      hw="lg:w-[45%] max-h-[95%]"
    >

      <div className="grid grid-cols-2 gap-4" >

        {selectedPlayers.map((player) => {
            return <PlayersCompareItem
              player={player}
              onRemove={onRemove}
            />
        })}

      </div>
    </DialogModal>
  );
}

