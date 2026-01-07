import useSWR from "swr"
import { IProAthlete } from "../../../types/athletes"
import { djangoAthleteService } from "../../../services/athletes/djangoAthletesService";
import { useMemo } from "react";
import { BarChartRecord, PlainBarChart } from "../../players/PlainBarChart";
import RoundedCard from "../../ui/cards/RoundedCard";

type Props = {
    player: IProAthlete
}

export default function PlayerPriceHistoryCard({ player }: Props) {
    const key = `/players/${player.tracking_id}/price-history`;
    const { data } = useSWR(key, () => djangoAthleteService.getPriceHistory(player.tracking_id));

    const history = useMemo(() => {
        return (data ?? []).sort((a, b) => {
            const aDate = (a.change_time ? new Date(a.change_time) : new Date()).valueOf();
            const bDate = (b.change_time ? new Date(b.change_time) : new Date()).valueOf();

            return aDate - bDate;
        });
    }, [data]);

    const records: BarChartRecord[] = useMemo(() => {
        return history.map((h) => {
            return {
                value: h.new_price,
                displayVal: `${h.new_price}`,
                className: "",
                date: h.change_time
            }
        })
    }, [history]);

    return (
        <RoundedCard className="p-4 dark:border-none flex flex-col gap-2" >
            <p className="text-sm font-bold" >Price History</p>

            <PlainBarChart
                records={records}
                maxValue={60}
                scaleFactor={2.5}
                pivotValue={player.price}
                xLabel="Price in SCRUM Coins"
            />
        </RoundedCard>
    )
}

