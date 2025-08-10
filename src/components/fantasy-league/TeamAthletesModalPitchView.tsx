import { RugbyPlayer } from "../../types/rugbyPlayer";
import { useAthletePointsBreakdown } from "../../hooks/useAthletePointsBreakdown";
import { PointsBreakdownItem } from "../../services/athletes/athleteService";
import RugbyPitch from "../shared/RugbyPitch";
import { PlayerGameCard } from "../player/PlayerGameCard";
import { ArrowUpDown } from "lucide-react";

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

export default function TeamAthletesModalPitchView({ athletes, handleKeyDown, handleViewBreakdown }: Props) {
    return (
        <div className="overflow-y-auto flex-1 h-full">
            {athletes.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No athletes found
                </div>
            ) : (
                <div className="relative h-full">
                    {/* Rugby pitch background */}
                    <div className="absolute inset-0 w-full h-full bg-green-700" >
                        <RugbyPitch count={4} />
                    </div>

                    {/* Athletes overlay */}
                    <div className="absolute overflow-y-auto inset-0 w-full h-full flex flex-col items-center justify-start  md:px-6" >

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 p-4 py-6" >
                            {athletes.map((athlete, index) => (
                                <TeamAthleteListItem
                                    athlete={athlete}
                                    key={index}
                                    handleKeyDown={handleKeyDown}
                                    handleViewBreakdown={handleViewBreakdown}
                                />
                            ))}
                        </div>
                    </div>
                </div>
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

    return (
        <div
            onClick={() => handleViewBreakdown(athleteId, points ?? [])}
            aria-disabled={isLoading}
            className="flex flex-col gap-2"
        >
            <PlayerGameCard
                player={athlete}
                className="h-[190px] w-[170px] md:h-[230px]"
            />

            <div className="text-white gap-2 flex flex-row items-center justify-center" >
                {isSub && <p className="bg-yellow-800 text-xs text-white flex flex-row items-center gap-1 md:text-sm px-2 rounded-xl" >
                    Sub
                    <ArrowUpDown className="w-2.5 h-2.5" />
                </p>}
                {<p className="font-bold text-sm" >{totalScore.toFixed(1)}</p>}
            </div>
        </div>
    );
}
