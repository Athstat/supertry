import { ChevronsUpDown } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { IProAthlete } from "../../../types/athletes";
import { SortField, SortDirection } from "../../../types/playerSorting";
import SecondaryText from "../../ui/typography/SecondaryText";
import { EmptyPlayerSearchState } from "../EmptyPlayerSearchState";
import { FantasyPointsScoredRankingItem } from "../../../types/fantasyLeagueGroups";
import { formatPosition } from "../../../utils/athleteUtils";
import { stripCountryName } from "../../../utils/stringUtils";
import { getCountryEmojiFlag } from "../../../utils/svrUtils";
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot";
import MatchPrCard from "../../rankings/MatchPrCard";
import RoundedCard from "../../ui/cards/RoundedCard";


type CustomSortField = "points" | "rank" | SortField;

// A custom type that adds a rank that is added on the client as the server doesn't return this
type CustomFantasyPointsScoredRankingItem = FantasyPointsScoredRankingItem & { rank: number }

type TableProps = {
    players: FantasyPointsScoredRankingItem[],
    onClick?: (player: IProAthlete) => void,
    onSort?: (field: CustomSortField, direction: SortDirection) => void,
    currentSortField?: CustomSortField,
    currentSortDirection?: SortDirection,
    searchQuery?: string,
    onClearSearchQuery?: () => void
}

/** Renders Players List Table */
export function FantasyPointsRankingTable({ players: unrankedPlayers, onClick, searchQuery, onClearSearchQuery }: TableProps) {

    const [currentSortField, setCurrentSortField] = useState<CustomSortField>("points");
    const [currentSortDirection, setCurrentSortDirection] = useState<SortDirection>("desc");

    const [isDelaying, setIsDelaying] = useState<boolean>(true);

    const onSort = (field: CustomSortField, direction: SortDirection) => {
        setCurrentSortField(field);
        setCurrentSortDirection(direction);
    }

    // Adds the rank on the client side for each player in order of points scored desc
    const players = useMemo<CustomFantasyPointsScoredRankingItem[]>(() => {
        return [...unrankedPlayers].sort((a, b) => {
            return (b.total_points || 0) - (a.total_points || 0)
        }).map((p, index) => {
            return { ...p, rank: index + 1 }
        });
    }, [unrankedPlayers]);

    const sortedPlayers = useMemo<CustomFantasyPointsScoredRankingItem[]>(() => {

        if (currentSortField === "points") {
            return [...players].sort((a, b) => {

                if (currentSortDirection === "desc") {
                    return (b.total_points || 0) - (a.total_points || 0)
                }

                return (a.total_points || 0) - (b.total_points || 0)
            })
        }

        if (currentSortField === "player_name") {
            return [...players].sort((a, b) => {

                if (currentSortDirection === "desc") {
                    return (b?.player_name || "").localeCompare(a?.player_name);
                }

                return (a?.player_name || "").localeCompare(b?.player_name);
            })

        }

        if (currentSortField === "power_rank_rating") {
            return [...players].sort((a, b) => {

                if (currentSortDirection === "desc") {
                    return (b.power_rank_rating || 0) - (a.power_rank_rating || 0)
                }

                return (a.power_rank_rating || 0) - (b.power_rank_rating || 0)
            })
        }

        if (currentSortField === "rank") {
            return [...players].sort((a, b) => {

                if (currentSortDirection === "desc") {
                    return (b?.rank || 0) - (a?.rank || 0)
                }

                return (a?.rank || 0) - (b?.rank || 0)
            })
        }

        return players;
    }, [currentSortDirection, currentSortField, players])

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
        <div className="w-full min-h-screen overflow-y-hidden " >
            <table className="w-full overflow-y-hidden"  >

                <thead>
                    <tr>

                        {/* <TableColumn
                            className="pb-4"
                            label="#No"
                            fieldName={"rank"}
                            currentSortDirection={currentSortDirection}
                            currentSortField={currentSortField}
                            onSort={onSort}
                        /> */}

                        <TableColumn
                            className="pb-4"
                            label="Player"
                            fieldName={'player_name'}
                            currentSortDirection={currentSortDirection}
                            currentSortField={currentSortField}
                            onSort={onSort}
                        />


                        <TableColumn
                            className="pb-4"
                            label="Fantasy Points"
                            fieldName={'points'}
                            currentSortDirection={currentSortDirection}
                            currentSortField={currentSortField}
                            onSort={onSort}
                        />

                        <TableColumn
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
                    {sortedPlayers.map(player => (
                        <RowItem
                            player={player}
                            onClick={handleClick}
                            key={player.tracking_id}
                        />
                    ))}
                </tbody>
            </table>

            {/* Empty State */}
            {isEmpty && !isDelaying && <EmptyPlayerSearchState searchQuery={searchQuery} onClearSearch={onClearSearchQuery} />}

        </div>
    )
}

type ColumnProps = {
    label?: string,
    fieldName: CustomSortField,
    currentSortDirection?: SortDirection,
    currentSortField?: CustomSortField,
    className?: string,
    onSort?: (field: CustomSortField, direction: SortDirection) => void
}

function TableColumn({ label, className, onSort, currentSortDirection, currentSortField, fieldName }: ColumnProps) {

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

export function FantasyPointsRankingTableLoadingSkeleton() {

    return (
        <div className="w-full min-h-screen" >
            <table className="w-full hidden"  >

                <thead>
                    <tr>

                        <TableColumn
                            className="pb-4"
                            label="Player"
                            fieldName={'player_name'}
                        />

                        <TableColumn
                            className="pb-4"
                            label="Fantasy Points"
                            fieldName={'points'}
                        />

                        <TableColumn
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

type Props = {
    player: CustomFantasyPointsScoredRankingItem,
    onClick?: (player: IProAthlete) => void
}

/** Renders a player role card */
function RowItem({ player, onClick }: Props) {

    const countryFlag = getCountryEmojiFlag(player.nationality, true);

    const handelClick = () => {
        if (onClick) {
            onClick(player);
        }
    }

    return (
        <tr
            onClick={handelClick}
            className="cursor-pointer dark:hover:bg-slate-800 hover:bg-slate-100"
        >
            {/* <td className="py-3 bg-red-500 w-fit" >
                <SecondaryText className="flex text-[10px] min-w-[5px] max-w-[5px] flex-row items-center justify-center w-full flex-1" >
                    {player.rank ? Math.floor(player.rank) : "-"}
                </SecondaryText>
            </td> */}

            <td className="py-3" >
                <div className="flex flex-row items-center gap-2" >
                    {/* <SecondaryText className="flex text-[12px] font-semibold mr-2 min-w-[5px] max-w-[5px] flex-row items-center justify-center w-full flex-1" >
                        {player.rank ? Math.floor(player.rank) : "-"}
                    </SecondaryText> */}

                    <div>
                        <SmartPlayerMugshot
                            url={player.image_url}
                            teamId={player.team_id}
                            playerImageClassName="bg-transparent"
                        />
                    </div>

                    <div>
                        <div>
                            <p className="text-sm max-w-[160px] truncate" >{player.player_name}</p>
                        </div>

                        <div className="flex flex-row items-center gap-2" >

                            <SecondaryText className="text-xs max-w-[100px] truncate text-nowrap" >{formatPosition(player.position)} </SecondaryText>

                            {player.nationality && (
                                <>
                                    <div className="w-1 h-1 rounded-full bg-slate-700 dark:bg-slate-400" ></div>

                                    <SecondaryText className="text-xs max-w-[60px] truncate text-nowrap" >
                                        {countryFlag} {stripCountryName(player.nationality)}
                                    </SecondaryText>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </td>

            <td className="py-3" >
                <div className="flex flex-row items-center justify-center w-full flex-1" >
                    {Math.floor(player.total_points || 0)}
                </div>
            </td>

            <td className="flex py-3 flex-col gap-1 items-center justify-center" >
                <MatchPrCard
                    pr={player.power_rank_rating}
                />
            </td>

        </tr>
    )
}
