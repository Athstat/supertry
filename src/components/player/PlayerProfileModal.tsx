import PlayerProfileBanner from "./profile-modal-components/PlayerProfileBanner";
import PlayerNameAndPosition from "./profile-modal-components/PlayerNameAndPosition";
import PlayerProfileModalTabContent from "./profile-modal-components/PlayerProfileModalTabContent";
import PlayerDataProvider from "./provider/PlayerDataProvider";
import DialogModal from "../shared/DialogModal";
import { IProAthlete } from "../../types/athletes";

interface Props {
  player: IProAthlete;
  isOpen: boolean;
  onClose: () => void;
  roundId?: string;
}

export default function PlayerProfileModal({ player, isOpen, onClose }: Props) {

  return (
    <PlayerDataProvider player={player} >
      <DialogModal
        open={isOpen}
        className="p-0 flex flex-col gap-2 "
        title={player?.player_name}
        outerCon="p-4 no-scrollbar"
        onClose={onClose}
        hw="w-[96%] max-h-[96vh] min-h-[96vh] md:w-[60%] lg:w-[40%]"
        
      >
        {/* Modal header with player image and close button */}
        <PlayerProfileBanner player={player} />

        {/* Stats Summary */}
        <PlayerNameAndPosition player={player} />

        <div className="flex-1 ">
          
          <PlayerProfileModalTabContent
            player={player}
          />

        </div>

      </DialogModal>
    </PlayerDataProvider>
  );
}
