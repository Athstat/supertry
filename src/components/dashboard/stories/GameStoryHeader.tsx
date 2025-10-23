import { PauseCircle, PlayCircle, X } from "lucide-react";
import { Fragment } from "react";
import AttackLeadersSlide from "./slides/AttackLeadersSlide";
import DefenseLeadersSlide from "./slides/DefenseLeadersSlide";
import KickingLeadersSlide from "./slides/KickingLeadersSlide";
import LineupsSlide from "./slides/LineupsSlide";
import OverviewSlide from "./slides/OverviewSlide";
import { useGameStory } from "../../../hooks/dashboard/useGameStory";
import { IFixture } from "../../../types/games";
import { useNavigate } from "react-router-dom";

const SLIDES = [
  { id: 'overview', title: 'Overview', component: OverviewSlide },
  { id: 'lineups', title: 'Lineups', component: LineupsSlide },
  { id: 'attack', title: 'Attack Leaders', component: AttackLeadersSlide },
  { id: 'defense', title: 'Defense Leaders', component: DefenseLeadersSlide },
  { id: 'kicking', title: 'Kicking Leaders', component: KickingLeadersSlide },
] as const;

type Props = {
  onClose?: () => void,
  currentGame: IFixture
}

/** Renders Game Story Progress Dots */
export default function GameStoryHeader({onClose } : Props) {

  const {
    currentSlideIndex, isPaused,
    setIsPaused: setPaused, progress,
    currentGame
  } = useGameStory();

  const navigate = useNavigate();

  const goToMoreDetails = () => {
    navigate(`/fixtures/${currentGame?.game_id}`)
  }

  if (!currentGame) return null;

  return (
    <Fragment>
      {/* Progress bars */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
        {SLIDES.map((_, index) => (
          <div key={index} className="flex-1 h-0.5 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{
                width: index === currentSlideIndex
                  ? `${progress}%`
                  : index < currentSlideIndex
                    ? '100%'
                    : '0%'
              }}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-12 left-4 right-4 z-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600 p-[1px]"> 
            <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
              {currentGame.team?.on_dark_image_url || currentGame.team?.image_url ? (
                <img
                  src={currentGame.team.on_dark_image_url || currentGame.team.image_url}
                  alt={currentGame.team.athstat_name}
                  className="w-5 h-5 object-contain"
                />
              ) : (
                <span className="text-xs font-bold">
                  {currentGame.team?.athstat_abbreviation || 'TM'}
                </span>
              )}
            </div>
          </div>
          <div>
            <div onClick={goToMoreDetails} className="text-sm font-semibold hover:underline cursor-pointer hover:text-blue-600">
              {currentGame.team?.athstat_name || 'Team'} vs {currentGame.opposition_team?.athstat_name || 'Opposition'}
            </div>
            <div className="text-xs text-gray-400">
              {SLIDES[currentSlideIndex].title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPaused(!isPaused)}
            className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-70 transition-colors text-xs font-bold"
          >
            {isPaused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-70 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </Fragment>
  )
}
