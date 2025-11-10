import { twMerge } from "tailwind-merge";
import { IFantasyLeagueRound } from "../../../types/fantasyLeague"
import { useMyTeamView } from "./MyTeamStateProvider";
import SaveTeamBar from "./SaveTeamBar";
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils";
import { Lock } from "lucide-react";
import { useFantasyLeagueTeam } from "./FantasyLeagueTeamProvider";
import { IGamesLeagueConfig } from "../../../types/leagueConfig";
import RoundedCard from "../../shared/RoundedCard";
import { Activity } from "react";
import { useRoundScoringSummary } from "../../../hooks/fantasy/useRoundScoringSummary";
import SecondaryText from "../../shared/SecondaryText";

type Props = {
    leagueRound: IFantasyLeagueRound,
    leagueConfig: IGamesLeagueConfig,
    onTeamUpdated: () => Promise<void>
}

/** Renders My Team View Header */
export default function MyTeamViewHeader({ leagueRound, leagueConfig, onTeamUpdated }: Props) {
    const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);
    const { totalSpent, selectedCount, team } = useFantasyLeagueTeam();

    return (
        <div className="px-4 flex flex-col gap-3.5" >

            <div className="flex flex-row  items-center justify-between" >

                <div className="flex flex-col w-full  flex-1 items-start justify-start">
                    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Selected
                    </div>
                    <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">
                        {selectedCount}/6
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                    <p className="font-bold ">{team?.first_name || "My Team"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
                        Game Week {leagueRound?.start_round}
                    </p>
                </div>

                <div className="flex-1 w-full flex flex-col items-end justify-center">
                    <div className="text-[10px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Total Spent
                    </div>
                    {leagueConfig && (
                        <div className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">
                            {totalSpent}/{leagueConfig?.team_budget}
                        </div>
                    )}
                </div>
            </div>

            {leagueRound && <SaveTeamBar leagueRound={leagueRound} onTeamUpdated={onTeamUpdated} />}

            {/* <Activity mode={isLocked ? "hidden" : "visible"} >
                <ViewSwitcher
                    leagueRound={leagueRound}
                />
            </Activity> */}

            <Activity mode={isLocked ? "visible" : "hidden"} >
                <TeamPointsCard
                    leagueRound={leagueRound}
                />
            </Activity>
        </div>
    )
}

type ViewSwitcherProps = {
    leagueRound: IFantasyLeagueRound
}

export function ViewSwitcher({ leagueRound }: ViewSwitcherProps) {

    const { viewMode, navigate: setViewMode } = useMyTeamView();
    const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);
    const { changesDetected } = useFantasyLeagueTeam();

    return (
        <Activity mode={changesDetected ? "hidden" : "visible"} >
            <RoundedCard className="flex p-1.5 bg-gray-50 border-slate-200  w-full justify-between flex-row items-center gap-2">
                <button
                    type="button"
                    onClick={() => setViewMode('edit')}
                    // disabled={isLocked}
                    className={twMerge(
                        'flex-1 h-[35px] rounded-lg text-sm flex text-center flex-row items-center justify-center gap-2 font-medium text-slate-500`',
                        viewMode === 'edit' && 'bg-blue-600 text-white dark:bg-blue-600'
                    )}
                >
                    <p>Edit</p>
                    {isLocked && <Lock className="w-4 h-4" />}
                </button>

                <button
                    type="button"
                    onClick={() => setViewMode('pitch')}
                    // disabled={isLocked}
                    className={twMerge(
                        'flex-1 h-[35px] rounded-lg text-sm flex text-center flex-row items-center  justify-center gap-2 font-medium text-slate-500`',
                        viewMode === 'pitch' && 'bg-blue-600 text-white dark:bg-blue-600 '
                    )}
                >
                    <p>Pitch</p>
                    {isLocked && <Lock className="w-4 h-4" />}
                </button>

            </RoundedCard>
        </Activity>
    )
}

type TeamPointsProps = {
    leagueRound: IFantasyLeagueRound
}

function TeamPointsCard({ leagueRound }: TeamPointsProps) {

    const { userScore, highestPointsScored, averagePointsScored, isLoading } = useRoundScoringSummary(leagueRound);

    return (
        <div className="flex flex-col py-2" >
            <Activity mode={isLoading ? "hidden" : "visible"} >
                <div className="flex flex-row items-center justify-center gap-6" >
                    <div className="flex flex-col items-center justify-center" >
                        <p className="font-black text-xl" >{Math.round(averagePointsScored ?? 0)}</p>
                        <SecondaryText>Average</SecondaryText>
                    </div>

                    <div className="flex flex-col items-center justify-center" >
                        <p className="font-black text-xl" >{Math.round(userScore ?? 0)}</p>
                        <SecondaryText>Your Score</SecondaryText>
                    </div>

                    <div className="flex flex-col items-center justify-center" >
                        <p className="font-black text-xl" >{Math.round(highestPointsScored ?? 0)}</p>
                        <SecondaryText>Highest</SecondaryText>
                    </div>
                </div>
            </Activity>
        </div>
    )
}