import { ChevronsUpDown } from "lucide-react"
import { twMerge } from "tailwind-merge"
import { IProAthlete } from "../../types/athletes"
import { SortField, SortDirection } from "../../types/playerSorting"
import PlayerRowCard from "../player/PlayerRowCard"
import SecondaryText from "../shared/SecondaryText"
import RoundedCard from "../shared/RoundedCard"
import { EmptyState } from "./EmptyState"
import { useEffect, useMemo, useState } from "react"

type TableProps = {
    players: IProAthlete[],
    onClick?: (player: IProAthlete) => void,
    onSort?: (field: SortField, direction: SortDirection) => void,
    currentSortField?: SortField,
    currentSortDirection?: SortDirection,
    searchQuery?: string,
    onClearSearchQuery?: () => void
}

/** Renders Players List Table */
export function PlayerListTable({ players, onClick, onSort, currentSortDirection, currentSortField, searchQuery, onClearSearchQuery }: TableProps) {

    const [isDelaying, setIsDelaying] = useState<boolean>(true);

    const handleClick = (player: IProAthlete) => {
        if (onClick) {
            onClick(player)
        }
    }

    const isEmpty = useMemo(() => {
        return players.length === 0;
    }, [players]);

    useEffect(() => {
        if (!isEmpty) return setIsDelaying(false);
        setIsDelaying(true);
        const timeout = setTimeout(() => setIsDelaying(false), 800);
        return () => clearTimeout(timeout);
    }, [isEmpty]);

    return (
        <div className="w-full min-h-screen" >
            <table className="w-full"  >

                <thead>
                    <tr>

                        <PlayerListTableColumn
                            className="pb-4"
                            label="Player"
                            fieldName={'player_name'}
                            currentSortDirection={currentSortDirection}
                            currentSortField={currentSortField}
                            onSort={onSort}
                        />

                        <PlayerListTableColumn
                            className="pb-4"
                            label="Price"
                            fieldName={'price'}
                            currentSortDirection={currentSortDirection}
                            currentSortField={currentSortField}
                            onSort={onSort}
                        />

                        <PlayerListTableColumn
                            className="pb-4"
                            label="Form"
                            fieldName={'form'}
                            currentSortDirection={currentSortDirection}
                            currentSortField={currentSortField}
                            onSort={onSort}
                        />

                        <PlayerListTableColumn
                            className="pb-4"
                            label="PR"
                            fieldName={'power_rank_rating'}
                            currentSortDirection={currentSortDirection}
                            currentSortField={currentSortField}
                            onSort={onSort}
                        />

                    </tr>
                </thead>

                <tbody
                    className="divide-y dark:divide-slate-700"
                >
                    {players.map(player => (
                        <PlayerRowCard
                            player={player}
                            onClick={handleClick}
                            key={player.tracking_id}
                        />
                    ))}
                </tbody>
            </table>

            {/* Empty State */}
            {isEmpty && !isDelaying && <EmptyState searchQuery={searchQuery} onClearSearch={onClearSearchQuery} />}

        </div>
    )
}

type ColumnProps = {
    label?: string,
    fieldName: SortField,
    currentSortDirection?: SortDirection,
    currentSortField?: SortField,
    className?: string,
    onSort?: (field: SortField, direction: SortDirection) => void
}

function PlayerListTableColumn({ label, className, onSort, currentSortDirection, currentSortField, fieldName }: ColumnProps) {

    const isCurrent = fieldName === currentSortField;

    const handleSort = () => {
        if (!onSort) {
            return;
        }

        if (fieldName === currentSortField) {
            const inverseDirection = currentSortDirection === "asc" ? "desc" : "asc";
            onSort(fieldName, inverseDirection);
            return;
        }

        onSort(fieldName, "desc");
    }

    return (
        <>
            <th className={twMerge(
                className,
            )} >
                <button onClick={handleSort} className="flex flex-row items-center gap-1" >
                    <SecondaryText>
                        {label}
                    </SecondaryText>

                    {isCurrent && (
                        <ChevronsUpDown className="text-slate-600 dark:text-slate-400 text-sm w-4 h-4" />
                    )}
                </button>
            </th>
        </>
    )
}

export function PlayerListTableLoadingSkeleton() {

    return (
        <div className="w-full min-h-screen" >
            <table className="w-full"  >

                <thead>
                    <tr>

                        <PlayerListTableColumn
                            className="pb-4"
                            label="Player"
                            fieldName={'player_name'}
                        />

                        <PlayerListTableColumn
                            className="pb-4"
                            label="Price"
                            fieldName={'price'}
                        />

                        <PlayerListTableColumn
                            className="pb-4"
                            label="Form"
                            fieldName={'form'}
                        />

                        <PlayerListTableColumn
                            className="pb-4"
                            label="PR"
                            fieldName={'power_rank_rating'}
                        />

                    </tr>
                </thead>
            </table>

            <div className="divide-y flex flex-col dark:divide-slate-700 w-full p-2 gap-4">
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
                <RoundedCard className="w-full h-[50px] border-none" />
            </div>

        </div >
    )
}