import { Shield } from "lucide-react";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { useFantasyLeagueTeam } from "./FantasyLeagueTeamProvider";


/** Renders Create Team View Header */
export default function CreateTeamViewHeader() {
    const { leagueConfig } = useFantasyLeagueGroup();
    const { totalSpent, selectedCount, leagueRound } = useFantasyLeagueTeam();

    if (!leagueRound || !leagueConfig) {
        return;
    }


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


                <div className="flex flex-row items-center justify-center text-center gap-1">

                    <div className="flex flex-row items-center gap-1" >
                        <Shield />
                        <p className="font-semibold ">Pick Your Team</p>
                    </div>
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

        </div>
    );
}