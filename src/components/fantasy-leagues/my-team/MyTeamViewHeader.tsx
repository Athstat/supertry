import { twMerge } from "tailwind-merge";
import { IFantasyLeagueRound } from "../../../types/fantasyLeague"
import { useMyTeamView } from "./MyTeamStateProvider";
import SaveTeamBar from "./SaveTeamBar";
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils";
import { Lock } from "lucide-react";
import { useFantasyLeagueTeam } from "./FantasyLeagueTeamProvider";
import { IGamesLeagueConfig } from "../../../types/leagueConfig";

type Props = {
    leagueRound: IFantasyLeagueRound,
    leagueConfig: IGamesLeagueConfig,
    onTeamUpdated: () => Promise<void>
}

/** Renders My Team View Header */
export default function MyTeamViewHeader({ leagueRound, leagueConfig, onTeamUpdated }: Props) {
    const { viewMode, navigate: setViewMode } = useMyTeamView();
    const isLocked = leagueRound && isLeagueRoundLocked(leagueRound);
    const { totalSpent, selectedCount } = useFantasyLeagueTeam();

    return (
        <div className="px-4" >
            <div className="flex flex-row items-center justify-between mb-5">
                <div className="flex flex-row items-center gap-2" style={{ marginTop: -20 }}>
                    <div className="flex flex-col">
                        <p className="font-bold text-xl">My Team</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
                            Your team for {leagueRound?.title}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setViewMode('edit')}
                        // disabled={isLocked}
                        className={twMerge(
                            'px-3 py-1.5 rounded-lg text-sm flex flex-row items-center gap-2 font-medium border border-gray-200 dark:border-gray-700`',
                            'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 dark:border-slate-700',
                            viewMode === 'edit' && 'bg-blue-600 dark:bg-blue-600 text-white'
                        )}
                    >
                        <p>Edit</p>
                        {isLocked && <Lock className="w-4 h-4" />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode('pitch')}
                        className={`${viewMode === 'pitch'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                            } px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700`}
                    >
                        Pitch
                    </button>
                </div>
            </div>

            {/* Top stats row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Selected
                    </div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {selectedCount}/6
                    </div>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 p-3">
                    <div className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400">
                        Total Spent
                    </div>
                    {leagueConfig && (
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {totalSpent}/{leagueConfig?.team_budget}
                        </div>
                    )}
                </div>
            </div>

            {leagueRound && <SaveTeamBar leagueRound={leagueRound} onTeamUpdated={onTeamUpdated} />}

        </div>
    )
}
