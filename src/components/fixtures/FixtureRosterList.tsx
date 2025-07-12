import { IRosterItem } from "../../types/games";
import { formatPosition } from "../../utils/athleteUtils";
import PlayerMugshot from "../shared/PlayerMugshot";

type RosterListProps = {
    roster: IRosterItem[]
}

/** Renders a roster list */
export function FixtureRosterList({ roster }: RosterListProps) {

    roster = roster.sort((a, b) => a.player_number - b.player_number);
    const starters = roster.filter((r) => {
        return !r.is_substitute;
    });

    const benchers = roster.filter((r) => {
        return r.is_substitute;
    });

    return (
        <div className="grid grid-cols-1 gap-3" >
            <h1 className="text-lg font-bold" >Starters</h1>
            {starters.map((starter) => {
                return <FixtureRosterListItem 
                    key={starter.athlete_id}
                    player={starter}
                />
            })}

            <h1 className="text-lg font-bold mt-3" >Bench</h1>

            {benchers.map((bencher) => {
                return <FixtureRosterListItem 
                    key={bencher.athlete_id}
                    player={bencher}
                />
            })}
        </div>
    )
}

type RosterListItemProps = {
    player: IRosterItem
}

function FixtureRosterListItem({player} : RosterListItemProps) {
    return (
        <div className="flex flex-row items-center gap-3" >
            <div>
                <p>{player.player_number}</p>
            </div>

            <div>
                <PlayerMugshot className="w-12 h-12" url={player.image_url} />
            </div>

            <div>
                <div className="text-md font-semibold flex flex-row items-center gap-2" >
                    {player.player_name}
                    {player.is_captain && <CaptainsArmBand />}
                </div>

                <p className="text-slate-700 dark:text-slate-400" >{player.position !== 'NULL' ? formatPosition(player.position) : ''}</p>
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