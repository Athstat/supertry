import useSWR from "swr"
import { IProAthlete } from "../../../types/athletes"
import { IProSeason } from "../../../types/season"
import { fantasySeasonsService } from "../../../services/fantasy/fantasySeasonsService"
import RoundedCard from "../../shared/RoundedCard"
import SecondaryText from "../../shared/SecondaryText"
import { abbreviateSeasonName } from "../../players/compare/PlayerCompareSeasonPicker"

type Props = {
    player: IProAthlete,
    season: IProSeason
}

export default function PlayerPercentageSelectedCard({ player, season }: Props) {

    const key = `/fantasy-seasons/${player.tracking_id}/players/${player.tracking_id}/percentage-selected`;
    const { data: selection, isLoading } = useSWR(key, () => fantasySeasonsService.getPlayerPercentageSelected(season.id, player.tracking_id));
    const abrr = abbreviateSeasonName(season.name);

    if (isLoading) {
        return (
            <RoundedCard className="w-full border-none h-[150px]" >

            </RoundedCard>
        )
    }

    if (!selection) {
        return;
    }

    return (
        <RoundedCard className="p-6 min-h-[150px] max-h-[150px] dark:border-none flex flex-col gap-3" >
            <p className="font-semibold text-sm" >{abrr} Fantasy</p>
            <div className="flex flex-row items-center justify-between " >

                <div className="flex flex-col items-center gap-2" >
                    <p className="text-lg font-semibold" >{player.price}</p>
                    <SecondaryText className="text-center text-[10px]" >Player Price <br/> (SCRUM Coins)</SecondaryText>
                </div>

                <div className="flex flex-col items-center gap-2" >
                    <p className="text-lg font-semibold" >{selection.times_selected}</p>
                    <SecondaryText className="text-center text-[10px]" >Times<br/> Selected</SecondaryText>
                </div>

                <div className="flex flex-col items-center gap-2" >
                    <p className="text-lg font-semibold" >{(selection.percentage_selected ?? 0).toFixed(2)}%</p>
                    <SecondaryText className="text-center text-[10px]" > Percentage <br/> Selected </SecondaryText>
                </div>
            </div>
        </RoundedCard>
    )
}
