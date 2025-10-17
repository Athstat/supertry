import { useEffect, useCallback } from "react";
import { IFixture } from "../../../types/games";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OverviewSlide from "./slides/OverviewSlide";
import AttackLeadersSlide from "./slides/AttackLeadersSlide";
import DefenseLeadersSlide from "./slides/DefenseLeadersSlide";
import KickingLeadersSlide from "./slides/KickingLeadersSlide";
import LineupsSlide from "./slides/LineupsSlide";
import { ScrummyDarkModeLogo } from "../../branding/scrummy_logo";
import GameStoryProvider from "./GameStoryProvider";
import { useGameStory } from "../../../hooks/dashboard/useGameStory";
import { useSetAtom } from "jotai";
import { gameStoryAtoms } from "../../../state/dashboard/gameStory.atoms";
import GameStoryHeader from "./GameStoryHeader";

type GameStoryModalProps = {
  games: IFixture[];
  currentGameIndex: number;
  onClose: () => void;
  onGameChange: (index: number) => void;
  onStoryComplete: (game: IFixture) => void;
  open: boolean;
}

const SLIDES = [
  { id: 'overview', title: 'Overview', component: OverviewSlide },
  { id: 'lineups', title: 'Lineups', component: LineupsSlide },
  { id: 'attack', title: 'Attack Leaders', component: AttackLeadersSlide },
  { id: 'defense', title: 'Defense Leaders', component: DefenseLeadersSlide },
  { id: 'kicking', title: 'Kicking Leaders', component: KickingLeadersSlide },
] as const;

export default function GameStoryModal({ games, currentGameIndex, onClose, onGameChange, onStoryComplete, open }: GameStoryModalProps) {

  return (
    <GameStoryProvider>

      <InnerModal
        currentGameIndex={currentGameIndex}
        games={games}
        onClose={onClose}
        onGameChange={onGameChange}
        onStoryComplete={onStoryComplete}
        open={open}
      />
    </GameStoryProvider>
  )
}


function InnerModal({ games, currentGameIndex, onClose, onGameChange, onStoryComplete, open }: GameStoryModalProps) {
  const {
    isPaused, currentSlideIndex, setCurrentSlideIndex,
    setProgress, setIsPaused: setPaused
  } = useGameStory();

  const setCurrentGame = useSetAtom(gameStoryAtoms.currentGameAtom);
  const currentGame = games[currentGameIndex];

  useEffect(() => {
    setCurrentGame(currentGame);
  }, [currentGame, setCurrentGame]);

  // Auto-progress timer
  useEffect(() => {
    if (!open || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next slide or next game
          setCurrentSlideIndex((slideIndex) => {
            if (slideIndex >= SLIDES.length - 1) {
              // Mark current game as viewed before moving to next
              onStoryComplete(games[currentGameIndex]);

              // Move to next game or close if last game
              if (currentGameIndex < games.length - 1) {
                onGameChange(currentGameIndex + 1);
                return 0;
              } else {
                onClose();
                return 0;
              }
            }
            return slideIndex + 1;
          });
          return 0;
        }
        return prev + 2; // Increase by 2% every 100ms (5 seconds total)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [open, isPaused, onClose, setProgress, setCurrentSlideIndex, onStoryComplete, games, currentGameIndex, onGameChange]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentSlideIndex, setProgress]);

  const nextSlide = useCallback(() => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // Mark current game as viewed before moving to next
      onStoryComplete(games[currentGameIndex]);

      // Move to next game or close if last game
      if (currentGameIndex < games.length - 1) {
        onGameChange(currentGameIndex + 1);
        setCurrentSlideIndex(0);
        setProgress(0);
      } else {
        onClose();
      }
    }
  }, [currentSlideIndex, setCurrentSlideIndex, onStoryComplete, games, currentGameIndex, onGameChange, setProgress, onClose]);

  const prevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [setCurrentSlideIndex, currentSlideIndex]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') onClose();
    if (e.key === ' ') {
      e.preventDefault();
      setPaused(!isPaused);
    }
  }, [nextSlide, prevSlide, onClose, setPaused, isPaused]);

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, currentSlideIndex, isPaused, handleKeyDown]);

  if (!open) return null;

  const CurrentSlideComponent = SLIDES[currentSlideIndex].component;

  return (
    <div className="fixed inset-0 z-[70] bg-black bg-opacity-90 flex items-center justify-center">
      <div className="relative w-[98vh] max-w-sm mx-auto h-[98vh] border border-slate-700 dark:border-slate-700 rounded-xl max-h-screen bg-gray-900 text-white overflow-hidden">

        <GameStoryHeader
          onClose={onClose}
          currentGame={currentGame}
        />

        {/* Navigation areas - only on upper portion to allow scrolling */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-0 w-1/3 h-32 z-10 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity"
          disabled={currentSlideIndex === 0}
        >
          {currentSlideIndex > 0 && (
            <div className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
              <ChevronLeft size={16} />
            </div>
          )}
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-0 w-1/3 h-32 z-10 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
            <ChevronRight size={16} />
          </div>
        </button>

        {/* Slide content */}
        <div className="h-full pt-24 pb-20">
          <CurrentSlideComponent game={currentGame} />
        </div>

        {/* Floating bottom navigation buttons */}
        <div className="absolute bottom-0 pb-2 left-4 right-4 z-20  flex items-center justify-between">
          <button
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className={`px-6 py-3 rounded-full bg-black bg-opacity-70 text-white font-medium transition-all ${currentSlideIndex === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-opacity-90'
              }`}
          >
            ← Back
          </button>

          <div className="flex flex-col items-center gap-1 text-xs text-gray-300">
            <ScrummyDarkModeLogo className="grayscale w-14 h-14 lg:w-14 lg:h-14" />
          </div>

          <button
            onClick={nextSlide}
            className="px-6 py-3 rounded-full bg-black bg-opacity-70 text-white font-medium hover:bg-opacity-90 transition-all"
          >
            {currentSlideIndex === SLIDES.length - 1 && currentGameIndex === games.length - 1 ? 'Close' : 'Next →'}
          </button>
        </div>

      </div>
    </div>
  );
}
