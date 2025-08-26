import { formatPosition } from "../../utils/athleteUtils";
import { CircleDollarSign } from "lucide-react";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import DialogModal from "../shared/DialogModal";
import PlayerMugshot from "../shared/PlayerMugshot";

type PlayerActionModalProps = {
  player: IFantasyTeamAthlete;
  onClose: () => void;
  onViewProfile: (player: IFantasyTeamAthlete) => void;
  league?: IFantasyLeagueRound,
  onViewPointsBreakdown: (player: IFantasyTeamAthlete) => void
}

export function PlayerActionModal({
  player,
  onClose,
  onViewProfile,
  onViewPointsBreakdown
}: PlayerActionModalProps) {

  // const key = swrFetchKeys.getAthleteById(player.tracking_id);
  // const { data: info, isLoading } = useSWR(key, () => djangoAthleteService.getAthleteById(player.tracking_id));

  const isLoading = false;
  const isSub = !player.is_starting;

  return (
    <DialogModal
      open={true}
      title={player.player_name}
      hw={"max-w-[95%] min-w-[95%] lg:max-w-[50%] lg:min-w-[50%]"}
      onClose={onClose}
    >

      <div className="">

        {/* Player Info */}
        <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 dark:bg-slate-700/30 rounded-lg">
          <div className="w-18 h-18 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {player.image_url ? (
              // <img
              //   src={player.image_url}
              //   alt={player.player_name}
              //   className="w-full h-full object-cover"
              // />

              <PlayerMugshot
                playerPr={player.power_rank_rating}
                showPrBackground
                url={player.image_url}
                className="w-20 h-20"
              />

            ) : (
              <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                {player.player_name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">

            <div className="flex items-center justify-between ">
              <span className="font-semibold w-full text-md dark:text-gray-100">
                {player.player_name}
              </span>
            </div>

            <div className="flex flex-col text-sm gap-2">
              {/* {!isLoading && info && <span className="text-gray-600 font-semibold w-full dark:text-gray-400">
                  {player.team_name}
                </span>} */}

              <div className="flex flex-col mt-1" >
                <span className=" text-slate-700 dark:text-slate-400 text-xs ">
                  {formatPosition(player.position ?? "")} |  {formatPosition(player.position_class ?? "")}
                </span>
              </div>

              {isLoading && <div className="h-2 w-10 rounded-lg bg-slate-300 dark:bg-slate-700 animate-pulse" ></div>}
              <p className="text-primary-700 dark:text-primary-500 font-bold flex flex-row gap-2 items-center">
                <CircleDollarSign className="text-yellow-400 w-5 h-5" /> {player.price}
              </p>

            </div>

            {isSub && (
              <div className="mt-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
                Super Sub - Can play any position
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => onViewPointsBreakdown(player)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-200 hover:bg-gray-100 dark:bg-slate-700/30 dark:hover:bg-dark-700/60 transition-colors text-gray-800 dark:text-gray-200"
          >
            {/* <Trophy
              size={24}
              className="text-primary-600 dark:text-primary-400"
            /> */}
            <span className="font-medium">Points Breakdown</span>
          </button>

          {<button
            onClick={() => onViewProfile(player)}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-200 hover:bg-gray-100 dark:bg-slate-700/30 dark:hover:bg-dark-700/60 transition-colors text-gray-800 dark:text-gray-200"
          >
            {/* <Users
              size={24}
              className="text-primary-600 dark:text-primary-400"
            /> */}
            <span className="font-medium">Profile</span>
          </button>}

        </div>
      </div>

    </DialogModal>
  );
}
