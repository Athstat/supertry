import { Fragment, useState } from "react";
import { useDashboard } from "../../../hooks/dashboard/useDashboard"
import { useRoundGames } from "../../../hooks/fixtures/useRoundGames";
import { IFixture } from "../../../types/games";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";
import GameStoryModal from "./GameStoryModal";

/** Renders an instagram like game stories carrousel component */
export default function GameStoriesCarrousel() {

  const { currentRound } = useDashboard();
  const { games, isLoading } = useRoundGames(currentRound);

  const [currentGameIndex, setCurrentGameIndex] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggle = () => setShowModal(prev => !prev);

  const onClickStoryItem = (game: IFixture) => {
    const gameIndex = games.findIndex(g => g.game_id === game.game_id);
    setCurrentGameIndex(gameIndex);
    toggle();
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2" >

        <div className="flex flex-row items-center flex-nowrap gap-2 overflow-x-auto" >
          <RoundedCard
            className="w-20 h-20 rounded-full border-none animate-pulse"
          />

          <RoundedCard
            className="w-20 h-20 rounded-full border-none animate-pulse"
          />

          <RoundedCard
            className="w-20 h-20 rounded-full border-none animate-pulse"
          />

          <RoundedCard
            className="w-20 h-20 rounded-full border-none animate-pulse"
          />

          <RoundedCard
            className="w-20 h-20 rounded-full border-none animate-pulse"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2" >

      <div>
        <SecondaryText className="font-semibold" >Game Stories @ {currentRound?.round_title}</SecondaryText>
      </div>

      <div className="flex flex-row w-full items-center gap-3 no-scrollbar overflow-x-auto pb-2" >
        {games.map((game) => (
          <div
            key={game.game_id}
            onClick={() => onClickStoryItem(game)}
            className="flex-shrink-0 cursor-pointer group"
          >
            <div className="relative">
              {/* Story ring gradient */}
              <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600 p-[2px] group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 p-[2px]">
                  <div className="w-full h-full rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center relative overflow-hidden">
                    {/* Team logos */}
                    <div className="flex items-center justify-center w-full h-full">
                      {game.team?.on_dark_image_url || game.team?.image_url ? (
                        <div className="flex items-center justify-center space-x-1">
                          <img 
                            src={game.team.on_dark_image_url || game.team.image_url}
                            alt={game.team.athstat_name}
                            className="w-5 h-5 object-contain"
                          />
                          {game.opposition_team?.on_dark_image_url || game.opposition_team?.image_url ? (
                            <img 
                              src={game.opposition_team.on_dark_image_url || game.opposition_team.image_url}
                              alt={game.opposition_team.athstat_name}
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                          {game.team?.athstat_abbreviation || 'TM'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team names below */}
            <div className="text-xs text-center mt-1 max-w-[72px]">
              <div className="text-gray-700 dark:text-gray-300 font-medium truncate">
                {game.team?.athstat_abbreviation || 'Team'}
              </div>
              <div className="text-gray-500 dark:text-gray-400 text-[10px] truncate">
                vs {game.opposition_team?.athstat_abbreviation || 'Opp'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Fragment>
          <GameStoryModal
            games={games}
            currentGameIndex={currentGameIndex}
            onClose={toggle}
            onGameChange={setCurrentGameIndex}
            open={true}
          />
        </Fragment>
      )}

    </div>
  )
}
