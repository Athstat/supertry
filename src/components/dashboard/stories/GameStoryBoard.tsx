import { X } from "lucide-react"
import { MdPause, MdPlayArrow } from "react-icons/md"
import { IFixture } from "../../../types/games"
import { twMerge } from "tailwind-merge"
import { useState, useEffect } from "react"
import { IRosterItem } from '../../../types/games';
import FaceoffSlide from "./FaceoffSlide";
import LineupsSlide from "./LineupsSlide";
import LeadersSlide from "./LeadersSlide";
import { gamesService } from '../../../services/gamesService';
import useSWR from "swr"
import Conditionally from "../../debug/Conditionally"
import { LoadingState } from "../../ui/LoadingState"

type Props = {
    game: IFixture,
    className?: string
    onClose?: () => void,
    open?: boolean,
}

export default function GameStoryBoard({ game, className, onClose }: Props) {
    // Navigation state
    const slides = [
        { title: "Faceoff" },
        { title: "Lineups" },
        { title: "Attacking" },
        { title: "Defence" },
        { title: "Kicking" },
    ];
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(Array(slides.length).fill(0));
    const [isPaused, setIsPaused] = useState(false);

    // Progress bar animation (auto-advance)
    useEffect(() => {
        if (isPaused) return;
        if (progress[current] >= 100) {
            if (current < slides.length - 1) {
                setCurrent(current + 1);
            }
            return;
        }
        const interval = setInterval(() => {
            setProgress((prev) => {
                const updated = [...prev];
                updated[current] = Math.min(100, updated[current] + 2);
                return updated;
            });
        }, 100); // ~5s per story
        return () => clearInterval(interval);
    }, [current, isPaused, progress, slides.length]);

    // Reset progress when slide changes
    useEffect(() => {
        setProgress((prev) => prev.map((_, i) => (i < current ? 100 : i === current ? 0 : 0)));
    }, [current]);

    const next = () => {
        if (current < slides.length - 1) {
            setCurrent(current + 1);
            setProgress((prev) => prev.map((_, i) => (i < current + 1 ? 100 : i === current + 1 ? 0 : 0)));
        }
    };
    const prev = () => {
        if (current > 0) {
            setCurrent(current - 1);
            setProgress((prev) => prev.map((_, i) => (i < current - 1 ? 100 : i === current - 1 ? 0 : 0)));
        }
    };


    // Fetch rosters for the fixture
    const fixtureId = game.game_id;
    const rostersKey = fixtureId ? `fixtures/${fixtureId}/rosters` : null;
    const { data: fetchedRosters, isLoading: loadingRosters } = useSWR<IRosterItem[]>(rostersKey, () => gamesService.getGameRostersById(fixtureId ?? ""));

    // Split rosters into home/away
    const homeTeam = game.team;
    const awayTeam = game.opposition_team;
    const homePlayers = fetchedRosters?.filter(r => r.team_id === homeTeam?.athstat_id) || [];
    const awayPlayers = fetchedRosters?.filter(r => r.team_id === awayTeam?.athstat_id) || [];

    // Render slide content
    const renderSlide = () => {
        if (loadingRosters) {
            return <LoadingState />;
        }

        switch (current) {
            case 0: // Faceoff
                return (
                    <FaceoffSlide
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        homePlayers={homePlayers}
                        awayPlayers={awayPlayers}
                    />
                );
            case 1: // Lineups
                return (
                    <LineupsSlide
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        homePlayers={homePlayers}
                        awayPlayers={awayPlayers}
                    />
                );
            case 2: // Attacking Leaders
                return (
                    <LeadersSlide
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        homePlayers={homePlayers}
                        awayPlayers={awayPlayers}
                        type="attacking"
                    />
                );
            case 3: // Defensive Leaders
                return (
                    <LeadersSlide
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        homePlayers={homePlayers}
                        awayPlayers={awayPlayers}
                        type="defensive"
                    />
                );
            case 4: // Kicking Leaders
                return (
                    <LeadersSlide
                        homeTeam={homeTeam}
                        awayTeam={awayTeam}
                        homePlayers={homePlayers}
                        awayPlayers={awayPlayers}
                        type="kicking"
                    />
                );
            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-bold mb-4">{slides[current]?.title || 'Unknown'}</h2>
                        <div className="text-gray-500">Slide {current + 1} of {slides.length}</div>
                    </div>
                );
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center bg-black top-0 left-0 fixed h-full z-[60] bg-opacity-65">
            <div
                className={twMerge(
                    'bg-white w-[95%] rounded-xl h-[95vh] relative overflow-hidden',
                    className
                )}
            >
                <div className="w-full h-full flex flex-col">
                    {/* Animated Progress Bars (Tabs) */}
                    <div className="flex flex-row items-center justify-center gap-2 px-4 pt-4 mb-2 select-none">
                        {slides.map((_, i) => {
                            // Determine pill state
                            const isPassed = i < current;
                            const isCurrent = i === current;
                            const isUpcoming = i > current;
                            return (
                                <div
                                    key={i}
                                    className={`flex-1 mx-1 rounded-full overflow-hidden transition-all duration-200 cursor-pointer ${isCurrent ? 'shadow-md' : ''}`}
                                    style={{ height: isCurrent ? 8 : 4, opacity: isUpcoming ? 0.5 : 1 }}
                                    onClick={() => {
                                        // If jumping forward, mark all previous as read
                                        setCurrent(i);
                                        setProgress((prev) => prev.map((_, j) => (j < i ? 100 : j === i ? 0 : 0)));
                                    }}
                                    onMouseDown={e => e.stopPropagation()}
                                >
                                    <div
                                        className={`transition-all duration-200 ${
                                            isPassed ? 'bg-blue-400' : isCurrent ? 'bg-blue-600' : 'bg-gray-200'
                                        }`}
                                        style={{ width: `${progress[i]}%`, height: '100%' }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <style>{`
                        .gsb-tab:hover { height: 12px !important; }
                    `}</style>
                    {/* Header */}
                    <div className="flex rounded-xl p-4 flex-row items-center justify-between">
                        <div>
                            {game.team?.athstat_name} vs {game.opposition_team?.athstat_name}
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <button
                                onClick={() => setIsPaused((p) => !p)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                                aria-label={isPaused ? 'Play' : 'Pause'}
                            >
                                {isPaused ? <MdPlayArrow size={20} /> : <MdPause size={20} />}
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Close">
                                <X />
                            </button>
                        </div>
                    </div>
                    {/* Slide content */}
                    <div className="flex-1 relative overflow-hidden">
                        {/* Navigation tap zones */}
                        <div 
                            className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                prev();
                            }}
                        />
                        <div 
                            className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault();
                                next();
                            }}
                        />
                        
                        {/* Slide content */}
                        <div className="w-full h-full">
                            {renderSlide()}
                        </div>
                    </div>
                    {/* Navigation controls (desktop only) */}
                    <div className="hidden md:flex flex-row items-center justify-between px-8 pb-6">
                        <button
                            onClick={prev}
                            disabled={current === 0}
                            className={`px-4 py-2 rounded-lg font-semibold ${current === 0 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            Prev
                        </button>
                        <button
                            onClick={next}
                            disabled={current === slides.length - 1}
                            className={`px-4 py-2 rounded-lg font-semibold ${current === slides.length - 1 ? 'bg-gray-200 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
