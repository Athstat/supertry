import { useMemo } from "react";
import { useSupportedAthletes } from "../../../hooks/athletes/useSupportedAthletes"
import { IProAthlete, PositionClass } from "../../../types/athletes";
import SecondaryText from "../../shared/SecondaryText";
import { ArrowRight } from "lucide-react";
import RoundedCard from "../../shared/RoundedCard";
import { PlayerGameCard } from "../../player/PlayerGameCard";

type Props = {
    positionClass?: PositionClass,
    positionName?: string,
    title?: string,
    description?: string,
    showViewMoreButton?: boolean
}

/** Renders a card that shows the top players in that position, using the athlete provider */
export default function TopPositionPlayers({ positionClass, positionName, title, description, showViewMoreButton }: Props) {

    const { athletes } = useSupportedAthletes();

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
        <div className="flex flex-col  gap-2" >
            <div className="flex flex-row items-center justify-between" >
                <div>
                    <p>{title}</p>
                    <SecondaryText>{description}</SecondaryText>
                </div>

                {showViewMoreButton && (
                    <div className="flex text-slate-600 dark:text-slate-400 flex-row items-center gap-2" >
                        <SecondaryText>View All</SecondaryText>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                )}

            </div>
            <div className="flex flex-row items-center gap-2 overflow-y-auto no-scrollbar" >
                {top5.map((a) => {
                    return (
                        <PlayerItem
                            player={a}
                            key={a.tracking_id}
                        />
                    )
                })}
            </div>
        </div>
    )
}

type PlayerItemProps = {
    player: IProAthlete
}

function PlayerItem({ player }: PlayerItemProps) {
    return (
        <div className=" dark:border-none flex flex-col items-center" >
            {/* <PlayerGameCard 
                player={player}
            /> */}

            
        </div>
    )
}