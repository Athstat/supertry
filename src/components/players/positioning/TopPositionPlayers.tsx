import { useMemo } from "react";
import { useSupportedAthletes } from "../../../hooks/athletes/useSupportedAthletes"
import { PositionClass } from "../../../types/athletes";

type Props = {
    positionClass?: PositionClass,
    positionName?: string,
    title?: string,
    description?: string,
    showViewMoreButton?: boolean
}

/** Renders a card that shows the top players in that position, using the athlete provider */
export default function TopPositionPlayers({ positionClass, positionName }: Props) {

    const {athletes} = useSupportedAthletes();
    
    const sortedPlayers = useMemo(() => {
        const positionPlayers = athletes.filter((a) => {
            return a.position_class === positionClass || a.position === positionName;
        });

        return positionPlayers.sort((a, b) => {
            return (b.power_rank_rating || 0) - (a.power_rank_rating || 0)
        });

    }, [athletes, positionClass, positionName]);

    const top5 = useMemo(() => {
        return [...sortedPlayers].slice(0, 5);
    }, [sortedPlayers]);

    return (
        <div>
            <p>{positionName}</p>
            <div>
                {top5.map((a) => {
                    return (
                        <div
                            key={a.tracking_id}
                        >
                            <p>{a.player_name}</p>
                            <p>{a.power_rank_rating}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
