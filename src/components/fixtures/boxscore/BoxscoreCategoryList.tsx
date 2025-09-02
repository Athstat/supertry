import useSWR from "swr"
import { djangoAthleteService } from "../../../services/athletes/djangoAthletesService"
import PlayerMugshot from "../../shared/PlayerMugshot"
import RoundedCard from "../../shared/RoundedCard"
import SecondaryText from "../../shared/SecondaryText"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import NoContentCard from "../../shared/NoContentMessage"

export type BoxscoreListRecordItem = {
    athleteId: string,
    stats: number[]
}

type BoxscoreHeader = {
    lable: string,
    key?: string,
    tooltip?: string
}

type BoxscoreCategoryListProps = {
    columnHeaders: BoxscoreHeader[],
    list: BoxscoreListRecordItem[],
    title?: string,
    noContentMessage?: string
}

/** Renders a boxscore table */
export function BoxscoreTable({ columnHeaders: statHeaders, list, title, noContentMessage }: BoxscoreCategoryListProps) {

    const [showMore, setShowMore] = useState(false);
    const maxIndex = list.length - 1;

    return (
        <div className="flex flex-col gap-2" >


            {title && <h1 className="font-bold text-lg " >{title}</h1>}

            <div className="flex flex-col  dark:border-slate-700/30 border gap-2 rounded-lg overflow-clip dark:bg-slate-700/20  bg-gray-50 border-gray-300 " >

                <div className="flex border-b text-slate-700 dark:text-slate-400 dark:bg-slate-700/20  bg-gray-200 dark:border-slate-700/40 p-3 flex-row w-full items-center justify-between" >

                    <div>
                        <p className="font-semibold text-sm" >Player</p>
                    </div>

                    <div className="flex  flex-row items-center justify-start gap-4 px-2" >

                        {statHeaders.map((h, index) => {
                            return (
                                <p key={index} className="w-[40px] truncate text-tart text-sm" >{h.lable}</p>
                            )
                        })}
                    </div>
                </div>

                <div className="flex divide-y dark:divide-gray-700/30 divide-gray-300 flex-col" >
                    {list.map((i, index) => {

                        if (index > maxIndex) return;

                        return (
                            <AthleteBoxscoreRecord
                                item={i}
                                index={index}
                                key={i.athleteId}
                            />
                        )
                    })}

                    {list.length === 0 && (
                        <div>
                            <NoContentCard 
                                message={noContentMessage || `Whoops, no ${title} stats yet!`}
                            />
                        </div>
                    )}

                </div>
            </div>

        </div>

    )
}

type AthleteBoxscoreItemProps = {
    item: BoxscoreListRecordItem,
    index: number
}

function AthleteBoxscoreRecord({ item, index }: AthleteBoxscoreItemProps) {

    const { athleteId } = item;
    const key = `/athletes/${athleteId}`;
    const { data: info, isLoading: loadingInfo } = useSWR(key, () => djangoAthleteService.getAthleteById(athleteId));

    if (loadingInfo) {
        return (
            <RoundedCard
                className="h-[50px] border-t border-slate-600 bg-slate-100 dark:bg-slate-700/30 mb-1 rounded-none animate-pulse border-none"
            />
        )
    }

    if (!info) return;

    return (
        <div className={twMerge(
            "p-2",
            // index % 2 == 1 && "dark:bg-slate-800/40  bg-slate-100"
        )} >

            <div className="flex flex-row items-center justify-between gap-2" >

                <div className="flex flex-row overflow-hidden items-center gap-4" >

                    {/* {index !== undefined && <SecondaryText>
                        {index + 1}
                    </SecondaryText>} */}

                    <PlayerMugshot
                        url={info?.image_url}
                        playerPr={info?.power_rank_rating}
                        showPrBackground
                        className="min-w-8 min-h-8 max-w-8 max-h-8 lg:w-14 lg:h-14"
                    />

                    <div className="truncate" >
                        <p className="text-sm lg:text-base truncate" >{`${info.player_name}`}</p>
                    </div>
                </div>

                <SecondaryText className="flex text-base gap-4 font-medium flex-row items-center" >

                    {item.stats.map((s) => {
                        return (
                            <p className="w-[40px] text-sm text-start" >{s}</p>
                        )
                    })}
                </SecondaryText>
            </div>
        </div>
    )
}