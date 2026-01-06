import { useMemo } from 'react';
import { IProAthlete } from '../../../types/athletes';
import { usePowerRankings } from '../../../hooks/athletes/usePowerRankings';
import { LoadingIndicator } from '../../ui/LoadingIndicator';
import { twMerge } from 'tailwind-merge';
import { getOpponent } from '../../../utils/fixtureUtils';
import { BarChartRecord, PlainBarChart } from '../../players/PlainBarChart';
import RoundedCard from '../../ui/cards/RoundedCard';

type Props = {
    player: IProAthlete
}

export default function PlayerPrTrendCard({ player }: Props) {

    const { data, isLoading } = usePowerRankings(player.tracking_id);

    const history = useMemo(() => {
        return (data || []);
    }, [data]);

    const records: BarChartRecord[] = useMemo(() => {
        const rs = history.map<BarChartRecord>((h) => {
            const pr = h.updated_power_ranking;

            let tier = "none";

            if (pr >= 90) {
                tier = "purple"
            } else if (pr >= 80) {
                tier = "green"
            } else if (pr >= 60) {
                tier = "yellow"
            } else if (pr <= 59) {
                tier = "red"
            }

            const opponent = getOpponent(h.game, player);

            return {
                value: h.updated_power_ranking,
                displayVal: `${h.updated_power_ranking}`,
                className: twMerge(
                    tier === "purple" && "bg-purple-500 dark:bg-purple-500",
                    tier === "green" && "bg-green-500 dark:bg-green-600",
                    tier === "yellow" && "bg-yellow-500 dark:bg-yellow-600",
                    tier === "red" && "bg-red-500 dark:bg-red-600",
                ),
                
                imageUrl: opponent?.image_url
            }
        });

        return rs;
    }, [history, player]);

    if (isLoading) {
        return <LoadingIndicator />
    }

    return (
        <RoundedCard className='p-4 flex flex-col gap-2' >
            <div>
                <p className='font-semibold text-sm' >Power Ranking Trend</p>
            </div>

            <PlainBarChart 
                records={records}
                maxValue={100}
                scaleFactor={1.5}
                xLabel='Power'
            />
        </RoundedCard>
    )
}


