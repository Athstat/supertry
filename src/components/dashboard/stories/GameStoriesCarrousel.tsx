import { useDashboard } from "../../../hooks/dashboard/useDashboard"
import { useRoundGames } from "../../../hooks/fixtures/useRoundGames";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";

/** Renders an instagram like game stories carrousel component */
export default function GameStoriesCarrousel() {

  const { currentRound } = useDashboard();
  const { isLoading } = useRoundGames(currentRound);

  // const [currentGame, setCurrentGame] = useState<IFixture>();
  // const [showModal, setShowModal] = useState<boolean>(false);

  // const toggle = () => setShowModal(prev => !prev);

  // const onClickStoryItem = (game: IFixture) => {
  //   setCurrentGame(game);
  //   toggle();
  // }

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

      <div className="flex flex-row w-full items-center gap-2 no-scrollbar overflow-x-auto" >
        
      </div>

      {/* {showModal && (
        <Fragment>
          {currentGame && (
            <GameStoryBoard
              game={currentGame}
              onClose={toggle}
              open={true}
            />
          )}
        </Fragment>
      )} */}

    </div>
  )
}
