import { IProAthlete } from "../../../types/athletes";
import PlayerMugshot from "../../shared/PlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";
import TeamLogo from "../../team/TeamLogo";

type Props = {
    rank: number | string,
    player: IProAthlete,
    onClick: (player: IProAthlete) => void,
    value: string | number
}

/** Renders a Horizontal Player Ranking Card */
export function PlayerRankingCard({ rank, onClick, player, value }: Props) {

    const handleOnClick = () => {
        if (onClick) {
            onClick(player);
        }
    }

    return (
        <div className="flex flex-col w-full" >
 
            <div onClick={handleOnClick} className="flex cursor-pointer flex-row items-center gap-4" >
                <div>
                    <SecondaryText>#{rank}</SecondaryText>
                </div>

                <div className="flex flex-row items-center gap-2" >
                    <PlayerMugshot className="w-14 bg-slate-100 dark:bg-blue-600 h-14" url={player.image_url} />
                    <TeamLogo className="w-8 h-8" url={player.team?.image_url} />
                </div>

                <div>
                    <p className="text-sm" >{player.player_name}</p>
                    <SecondaryText className="text-xs" >{player.team?.athstat_name}</SecondaryText>
                </div>

                <div className="flex-1 w-full flex mr-4 flex-row items-center justify-end" >
                    <p className="font-bold text-sm" >{value}</p>
                </div>
            </div>

        </div>
    )
}