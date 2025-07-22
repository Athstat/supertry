import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { IProSeason } from "../../../types/season";

const abbreviateSeasonName = (seasonName: string): string => {
    if (seasonName.startsWith("United Rugby Championship")) {
        return seasonName.replace("United Rugby Championship", "URC");
    }
    if (seasonName.startsWith("EPCR Challenge Cup")) {
        return seasonName.replace("EPCR Challenge Cup", "EPRC");
    }
    if (seasonName.startsWith("Investec Champions Cup")) {
        return seasonName.replace("Investec Champions Cup", "Invest Cup");
    }
    return seasonName;
};

type Props = {
    seasons: IProSeason[];
    currSeason: IProSeason | undefined;
    setCurrSeason: (newSzn: IProSeason) => void;
};

export default function PlayerCompareSeasonPicker({ seasons, currSeason, setCurrSeason }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (currSeason === undefined) {
            setCurrSeason(seasons[0]);
        }
    }, [currSeason, seasons]);

    const handleSeasonSelect = (season: IProSeason) => {
        setCurrSeason(season);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-3 py-2 bg-slate-200 dark:bg-slate-700/40 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent dark:text-gray-100 flex items-center justify-between hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            >
                <span className="truncate">
                    {currSeason ? abbreviateSeasonName(currSeason.name) : "Select Season"}
                </span>
                <ChevronDown
                    className={`h-4 w-4 transition-transform flex-shrink-0 ml-2 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-600">
                    <div className="max-h-48 overflow-auto">
                        {seasons.map((season) => (
                            <button
                                key={season.id}
                                type="button"
                                onClick={() => handleSeasonSelect(season)}
                                className="w-full px-3 py-2 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700 dark:text-gray-100 transition-colors"
                            >
                                <span className="truncate">{abbreviateSeasonName(season.name)}</span>
                                {currSeason?.id === season.id && (
                                    <Check className="h-4 w-4 text-primary-500 flex-shrink-0 ml-2" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
