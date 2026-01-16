import { ScoutingListPlayer } from "../../../types/fantasy/scouting";
import { formatPosition } from "../../../utils/athletes/athleteUtils";
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot";
import MatchPrCard from "../../rankings/MatchPrCard";
import RoundedCard from "../../ui/cards/RoundedCard";
import SecondaryText from "../../ui/typography/SecondaryText";


type Props = {
    item: ScoutingListPlayer,
    onClick?: (player: ScoutingListPlayer) => void
}

export function ScoutingListPlayerCard({ item, onClick }: Props) {

    return (
        <Content item={item} onClick={onClick} />
    )

}


function Content({ item, onClick }: Props) {
    const { athlete } = item;

    const handleOnClick = () => {
        if (onClick) {
            onClick(item);
        }
    }

    return (
        <RoundedCard onClick={handleOnClick} className="px-4 py-3 flex flex-col gap-2 cursor-pointer rounded-xl" >
            
            <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row items-center gap-2" >
                    <div>
                        <SmartPlayerMugshot
                            url={athlete.image_url}
                            teamId={athlete.team_id}
                        />
                    </div>
                    <div>
                        <p>{athlete.player_name}</p>
                        <SecondaryText>{formatPosition(athlete.position_class)} - {formatPosition(athlete.position)}</SecondaryText>
                    </div>

                </div>

                <div className="flex flex-col items-center justify-center gap-1" >
                    <MatchPrCard
                        pr={athlete.power_rank_rating}
                    />
                    <SecondaryText className="text-xs" >Rating</SecondaryText>
                </div>
            </div>

        </RoundedCard>
    )
}