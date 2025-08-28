import useSWR from "swr"
import { djangoAthleteService } from "../../../services/athletes/djangoAthletesService"
import PlayerMugshot from "../../shared/PlayerMugshot"
import RoundedCard from "../../shared/RoundedCard"
import SecondaryText from "../../shared/SecondaryText"

type BoxscoreListRecordItem = {
    athleteId: string,
    stats: (string | number)[]
}

type BoxscoreHeader = {
    lable: string,
    key?: string,
    tooltip?: string
}

type BoxscoreCategoryListProps = {
    columnHeaders: BoxscoreHeader[],
    list: BoxscoreListRecordItem[],
    title?: string
}

/** Renders a boxscore table */
export function BoxscoreTable({columnHeaders: statHeaders, list, title} : BoxscoreCategoryListProps) {
    return (
        
        <div className="flex flex-row items-center justify-between" >
            
            {title && <h1>{title}</h1>}
            
            <div>
                <div>
                    <p>Athlete</p>
                </div>

                <div className="flex flex-row items-center gap-2" >

                    {statHeaders.map((h, index) => {
                        return (
                            <p key={index} className="w-[40px] text-end" >{h.lable}</p>
                        )
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-4" >
                {list.map((i, index) => {
                    return (
                        <AthleteBoxscoreRecord
                            item={i}
                            index={index}
                        />
                    )
                })}
            </div>
        </div>

    )
}

type AthleteBoxscoreItemProps = {
    item: BoxscoreListRecordItem,
    index: number
}

function AthleteBoxscoreRecord({ item, index }: AthleteBoxscoreItemProps ) {

    const {athleteId} = item;
    const key = `/athletes/${athleteId}`;
    const { data: info, isLoading: loadingInfo } = useSWR(key, () => djangoAthleteService.getAthleteById(athleteId));

    if (loadingInfo) {
        return (
            <RoundedCard
                className="h-[80px] rounded-xl animate-pulse border-none"
            />
        )
    }

    if (!info) return;

    return (
        <div className="p-2" >

            <div className="flex flex-row items-center justify-between gap-2" >
                <div className="flex flex-row items-center gap-2" >

                    {index !== undefined && <div>
                        {index + 1}
                    </div>}

                    <PlayerMugshot
                        url={info?.image_url}
                        playerPr={info?.power_rank_rating}
                        showPrBackground
                        className="w-10 h-10 lg:w-14 lg:h-14"
                    />

                    <div>
                        <p className="font-semibold" >{info?.player_name}</p>
                    </div>
                </div>

                <SecondaryText className="flex text-base font-medium flex-row items-center" >

                    {item.stats.map((s) => {
                        return (
                            <p className="w-[40px] text-end" >{s}</p>
                        )
                    })}
                </SecondaryText>
            </div>
        </div>
    )
}