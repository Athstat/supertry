import { useState, useEffect } from "react";
import { IFixture } from "../../../types/games";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import OverviewSlide from "./slides/OverviewSlide";
import AttackLeadersSlide from "./slides/AttackLeadersSlide";
import DefenseLeadersSlide from "./slides/DefenseLeadersSlide";
import KickingLeadersSlide from "./slides/KickingLeadersSlide";
import LineupsSlide from "./slides/LineupsSlide";

interface GameStoryModalProps {
  game: IFixture;
  onClose: () => void;
  open: boolean;
}

const SLIDES = [
  { id: 'overview', title: 'Overview', component: OverviewSlide },
  { id: 'lineups', title: 'Lineups', component: LineupsSlide },
  { id: 'attack', title: 'Attack Leaders', component: AttackLeadersSlide },
  { id: 'defense', title: 'Defense Leaders', component: DefenseLeadersSlide },
  { id: 'kicking', title: 'Kicking Leaders', component: KickingLeadersSlide },
] as const;

export default function GameStoryModal({ game, onClose, open }: GameStoryModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setPaused] = useState(false);

  // Auto-progress timer
  useEffect(() => {
    if (!open || isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          // Move to next slide
          setCurrentSlideIndex((slideIndex) => {
            if (slideIndex >= SLIDES.length - 1) {
              onClose();
              return 0;
            }
            return slideIndex + 1;
          });
          return 0;
        }
        return prev + 2; // Increase by 2% every 100ms (5 seconds total)
      });
    }, 100);

    return () => clearInterval(interval);
  }, [open, isPaused, onClose]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentSlideIndex]);

  const nextSlide = () => {
    if (currentSlideIndex < SLIDES.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      onClose();
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') onClose();
    if (e.key === ' ') {
      e.preventDefault();
      setPaused(!isPaused);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, currentSlideIndex, isPaused]);

  if (!open) return null;

  const CurrentSlideComponent = SLIDES[currentSlideIndex].component;

  return (
    <div className="fixed inset-0 z-[70] bg-black bg-opacity-95 flex items-center justify-center">
      <div className="relative w-full max-w-sm mx-auto h-full max-h-screen bg-gray-900 text-white overflow-hidden">
        
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400 p-[1px]">
              <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
                {game.team?.on_dark_image_url || game.team?.image_url ? (
                  <img 
                    src={game.team.on_dark_image_url || game.team.image_url}
                    alt={game.team.athstat_name}
                    className="w-5 h-5 object-contain"
                  />
                ) : (
                  <span className="text-xs font-bold">
                    {game.team?.athstat_abbreviation || 'TM'}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold">
                {game.team?.athstat_name || 'Team'} vs {game.opposition_team?.athstat_name || 'Opposition'}
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
              {isPaused ? '▶' : '⏸'}
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

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
          <CurrentSlideComponent game={game} />
        </div>

        {/* Floating bottom navigation buttons */}
        <div className="absolute bottom-6 left-4 right-4 z-20 flex items-center justify-between">
          <button 
            onClick={prevSlide}
            disabled={currentSlideIndex === 0}
            className={`px-6 py-3 rounded-full bg-black bg-opacity-70 text-white font-medium transition-all ${
              currentSlideIndex === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-opacity-90'
            }`}
          >
            ← Back
          </button>
          
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>{currentSlideIndex + 1}</span>
            <span>/</span>
            <span>{SLIDES.length}</span>
          </div>
          
          <button 
            onClick={nextSlide}
            className="px-6 py-3 rounded-full bg-black bg-opacity-70 text-white font-medium hover:bg-opacity-90 transition-all"
          >
            {currentSlideIndex === SLIDES.length - 1 ? 'Close' : 'Next →'}
          </button>
        </div>

      </div>
    </div>
  );
}
