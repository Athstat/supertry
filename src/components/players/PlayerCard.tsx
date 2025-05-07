import { RugbyPlayer } from "../../types/rugbyPlayer";
import FormIndicator from "../shared/FormIndicator";

interface PlayerCardProps {
  player: RugbyPlayer;
  onClick: () => void;
}

export const PlayerCard = ({ player, onClick }: PlayerCardProps) => {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-dark-800/40 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow w-full"
    >
      {/* Image Container */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={player.image_url}
          alt={player.player_name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        {/* Player Name and Position */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="font-bold text-lg text-white leading-tight">
            {player.player_name}
          </h3>
          <span className="text-sm text-gray-200 opacity-90">
            {player.position_class
              ? player.position_class
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")
              : ""}
          </span>
        </div>
      </div>

      {/* Player Details Container */}
      <div className="p-3 space-y-2">
        {/* Fantasy Points */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Fantasy Points
          </span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {player.power_rank_rating}
          </span>
        </div>

        {/* Team */}
        <div className="flex">
          <img
            src={player.team_logo}
            alt={`${player.team_name} logo`}
            className="h-6 w-6 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
            }}
          />
          <span className="font-medium text-gray-900 dark:text-gray-100 ml-3 text-left">
            {player.team_name}
          </span>

          {player.form && <div className="flex-1 flex flex-row items-center justify-end">
            <FormIndicator form={player.form} />
          </div>}
        </div>
      </div>
    </button>
  );
};
