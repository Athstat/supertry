import { useMemo } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker"
import { IProTeam } from "../../types/team";
import SecondaryText from "../shared/SecondaryText";
import TeamLogo from "../team/TeamLogo";
import { twMerge } from "tailwind-merge";
import { X } from "lucide-react";
import { BudgetIndicator } from "../team-creation/AvailableFilter";


export default function PlayerPickerTeamFilterRow() {

    const { availbleTeams, filterTeams, setFilterTeams, maxPrice } = usePlayerPicker();
    const len = filterTeams.length;

    if (availbleTeams.length <= 0) {
        return;
    }

    const handleClearFilter = () => {
        setFilterTeams([]);
    }

    return (
        <div className="flex flex-col gap-1" >

            <div className="flex flex-row items-center justify-between " >

                <div className="flex flex-row items-center gap-1" >
                    <SecondaryText>Filter By Team: </SecondaryText>
                    {len >= 1 && (
                        <button onClick={handleClearFilter} className={twMerge(
                            'bg-blue-500 dark:bg-blue-600 rounded-full px-3 py-1 text-[10px] flex flex-col items-center justify-center',
                            'flex flex-row items-center gap-1'
                        )} >
                            <p>Clear ({len})</p>
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>

                <BudgetIndicator budget={maxPrice} maxBudget={240} />

            </div>
            <div className="flex flex-row items-center text-nowrap flex-nowrap gap-2 overflow-x-auto no-scrollbar" >
                {availbleTeams.map((t) => {
                    return (
                        <TeamFilterItem key={t.athstat_id} team={t} />
                    )
                })}
            </div>
        </div>
    )
}

type FilterItemProps = {
    team: IProTeam
}

function TeamFilterItem({ team }: FilterItemProps) {

    const { filterTeams, setFilterTeams } = usePlayerPicker();

    const isSelected = useMemo(() => {
        return filterTeams.find((t) => t.athstat_id === team.athstat_id) !== undefined;
    }, [filterTeams, team]);

    const handleClick = () => {
        if (isSelected) {
            setFilterTeams((prev) => {
                return prev.filter(p => {
                    return p.athstat_id !== team.athstat_id
                })
            })
        } else {
            setFilterTeams(prev => [...prev, team]);
        }
    }

    return (
        <button
            onClick={handleClick}
            className={twMerge(
                "flex flex-row items-center gap-2 px-4 py-1.5 bg-slate-200 dark:bg-slate-700/40 rounded-full hover:dark:bg-slate-700",
                isSelected && "bg-blue-500 dark:bg-blue-600 hover:bg-slate-600 dark:hover:bg-blue-700 text-white"
            )}
        >
            <TeamLogo url={team.image_url} className="w-4 h-4" />
            <p className="text-xs dark:text-white" >{team.athstat_name}</p>

            {isSelected && <X className="w-3.5 h-3.5" />}
        </button>
    )
}
