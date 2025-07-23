import ModalHeader from "./profile-modal-components/ModalHeader";
import PlayerStats from "./profile-modal-components/PlayerStats";
import PlayerInfo from "./profile-modal-components/PlayerInfo";
import PlayerIconsCard from "./profile-modal-components/PlayerIconsCard";
import PlayerProfileModalTabContent from "./profile-modal-components/PlayerProfileModalTabContent";
import usePlayerStats from "./profile-modal-components/usePlayerStats";

interface Props {
  player: any;
  isOpen: boolean;
  onClose: () => void;
  roundId?: string;
}

export function PlayerProfileModal ({player, isOpen, onClose}: Props) {


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[200] flex items-center justify-center ">
      <div className="bg-white dark:bg-black w-[95%] max-w-2xl mx-auto my-4 rounded-lg shadow-xl h-[95vh] lg:h-[95vh] overflow-y-auto flex flex-col">

        <div className="bg-white dark:bg-dark-800/60 w-full rounded-lg shadow-xl h-full overflow-y-auto flex flex-col">
          {/* Modal header with player image and close button */}
          <ModalHeader player={player} onClose={onClose} />

          {/* Stats Summary */}
          <PlayerStats player={player} />

          {/* Player Name and Position */}
          <PlayerInfo player={player} />

          {/* Player Icons */}

          {/* <div className="p-4">
            <PlayerStatsContextInfo />
          </div> */}

          {/* Tabs Navigation */}
          {/* <TabsNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          /> */}

          {/* Tab Content - scrollable */}
          <div className="flex-1 ">
            <PlayerProfileModalTabContent
              player={player}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileModal;
