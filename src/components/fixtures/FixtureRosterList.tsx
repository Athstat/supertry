import { IProAthlete } from "../../types/athletes";
import { IRosterItem } from "../../types/games";
import { formatPosition } from "../../utils/athleteUtils";
import PlayerMugshot from "../shared/PlayerMugshot";

type RosterListProps = {
    roster: IRosterItem[],
    onClickPlayer?: (player: IProAthlete) => void
}

/** Renders a roster list */
export function FixtureRosterList({ roster, onClickPlayer }: RosterListProps) {

    roster = roster.sort((a, b) => (a.player_number ?? 0) - (b.player_number ?? 0));
    const starters = roster.filter((r) => {
        return !r.is_substitute;
    });

    const benchers = roster.filter((r) => {
        return r.is_substitute;
    });

    const handleClick = (player: IProAthlete) => {
        if (onClickPlayer) {
            onClickPlayer(player);
        }
    }

    return (
        <div className="grid grid-cols-1 gap-3" >
            <h1 className="text-lg font-bold" >Starters</h1>
            {starters.map((starter) => {
                return <FixtureRosterListItem 
                    key={starter.athlete.tracking_id}
                    player={starter}
                    onClick={handleClick}
                />
            })}

            <h1 className="text-lg font-bold mt-3" >Bench</h1>

            {benchers.map((bencher) => {
                return <FixtureRosterListItem 
                    key={bencher.athlete.tracking_id}
                    player={bencher}
                    onClick={handleClick}
                />
            })}
        </div>
    )
}

type RosterListItemProps = {
    player: IRosterItem,
    onClick?: (player: IProAthlete) => void
}

function FixtureRosterListItem({player, onClick} : RosterListItemProps) {
    
    const handleClickPlayer = () => {
        if (onClick) {
            onClick(player.athlete);
        }
    }
    
    return (
        <div onClick={handleClickPlayer} className="flex cursor-pointer flex-row items-center gap-3 hover:bg-slate-200 hover:dark:bg-slate-800/60 px-2 py-1 rounded-xl" >
            <div>
                <p>{player.player_number}</p>
            </div>

            <div>
                <PlayerMugshot showPrBackground playerPr={player.athlete.power_rank_rating} className="w-12 h-12" url={player.athlete.image_url} />
            </div>

            <div>
                <div className="text-md font-semibold flex flex-row items-center gap-2" >
                    {player.athlete.player_name}
                    {player.is_captain && <CaptainsArmBand />}
                </div>

                <p className="text-slate-700 dark:text-slate-400" >{player.position !== 'NULL' ? formatPosition(player.position ?? "") : ''}</p>
            </div>
        </div>
    )
}

export function CaptainsArmBand() {
    return (
        <div className="w-8 h-5 bg-black rounded-md flex items-center justify-center text-white dark:bg-white dark:text-black text-sm" >
            <p>C</p>
        </div>
    )
}