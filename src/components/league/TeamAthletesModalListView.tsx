import { ChevronRight, User } from "lucide-react";
import { RugbyPlayer } from "../../types/rugbyPlayer";
import { twMerge } from "tailwind-merge";
import { useAthletePointsBreakdown } from "../../hooks/useAthletePointsBreakdown";
import { PointsBreakdownItem } from "../../services/athletes/athleteService";
import { formatPosition } from "../../utils/athleteUtils";

type Props = {
    athletes: RugbyPlayer[],
    handleViewBreakdown: (
        athleteId: string,
        pointsBreakDown: PointsBreakdownItem[]
    ) => void;
    handleKeyDown: (
        e: React.KeyboardEvent<HTMLButtonElement>,
        athleteId: string,
        pointsBreakDown: PointsBreakdownItem[]
    ) => void;
}

export default function TeamAthletesModalListView({ athletes, handleKeyDown, handleViewBreakdown }: Props) {
    return (
        <div className="overflow-y-auto flex-1">
            {athletes.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No athletes found
                </div>
            ) : (
                <ul className="divide-y dark:divide-gray-700">
                    {athletes.map((athlete, index) => {
                        return (
                            <TeamAthleteListItem
                                athlete={athlete}
                                key={index}
                                handleKeyDown={handleKeyDown}
                                handleViewBreakdown={handleViewBreakdown}
                            />
                        );
                    })}
                </ul>
            )}
        </div>
    )
}


type ListItemProps = {
    athlete: RugbyPlayer;
    handleViewBreakdown: (
        athleteId: string,
        pointsBreakDown: PointsBreakdownItem[]
    ) => void;
    handleKeyDown: (
        e: React.KeyboardEvent<HTMLButtonElement>,
        athleteId: string,
        pointsBreakDown: PointsBreakdownItem[]
    ) => void;
};

function TeamAthleteListItem({
    athlete,
    handleViewBreakdown,
    handleKeyDown,
}: ListItemProps) {
    const athleteId = athlete.id ?? "fall-back-id";

    const { data: points, isLoading } = useAthletePointsBreakdown(
        athlete.tracking_id ?? "default-tracking-id"
    );

    const totalScore: number = points
        ? points.reduce((currTotal, action) => {
            return currTotal + action.score;
        }, 0)
        : 0;

    const isSub = !athlete.is_starting;

    console.log("Points Breakdown 2.0", athlete.player_name, points);

    return (
        <li>
            <div
                onClick={() => handleViewBreakdown(athleteId, points ?? [])}
                aria-disabled={isLoading}
                className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                {/* Athlete Image */}
                <div className="flex-shrink-0">
                    {athlete.image_url ? (
                        <img
                            src={athlete.image_url}
                            alt={athlete.player_name || "Athlete"}
                            className="w-12 h-12 rounded-full object-cover object-top bg-gray-100 dark:bg-gray-700"
                            onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.src =
                                    "https://media.istockphoto.com/id/1300502861/vector/running-rugby-player-with-ball-isolated-vector-illustration.jpg?s=612x612&w=0&k=20&c=FyedZs7MwISSOdcpQDUyhPQmaWtP08cow2lnofPLgeE=";
                            }}
                        />
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User size={24} className="text-gray-400" />
                        </div>
                    )}
                </div>

                {/* Athlete Info */}
                <div className="flex-1">
                    <div className="font-medium dark:text-white">
                        {athlete.player_name}
                    </div>
                    <div
                        className={twMerge(
                            "text-sm text-gray-500 dark:text-gray-400 w-fit rounded-xl",
                            isSub &&
                            "bg-orange-600 w-fit font-bold px-2 text-white dark:text-white"
                        )}
                    >
                        {formatPosition(athlete.position ?? "")}{" "}
                        {isSub ? "· Super Sub 🌟" : ""}
                    </div>
                </div>

                {/* Athlete Stats with View Details Button */}
                <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        {isLoading && (
                            <p className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 animate-pulse"></p>
                        )}
                        {!isLoading && <p>{totalScore?.toFixed(1)}</p>}
                    </div>
                    <button
                        onKeyDown={(e) => handleKeyDown(e, athleteId, points ?? [])}
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={`View points breakdown for ${athlete.player_name}`}
                        tabIndex={0}
                    >
                        <ChevronRight
                            size={20}
                            className="text-gray-500 dark:text-gray-400"
                        />
                    </button>
                </div>
            </div>
        </li>
    );
}
