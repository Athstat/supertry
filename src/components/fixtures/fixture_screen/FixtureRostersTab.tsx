import { Activity, useCallback, useMemo, useState } from "react"
import { IFixture, IRosterItem } from "../../../types/games"
import FixtureTeamSelector from "../boxscore/FixtureTeamSelector"
import { IProTeam } from "../../../types/team"
import { RugbyPitch3D } from "../../shared/RugbyPitch"
import { useGameRosters } from "../../../hooks/fixtures/useGameRosters"
import PlayerMugshot from "../../shared/PlayerMugshot"
import TeamJersey from "../../player/TeamJersey"

type Props = {
    fixture: IFixture
}

export default function FixtureRostersTab({ fixture }: Props) {

    const [team, setTeam] = useState<IProTeam | undefined>(fixture?.team);

    return (
        <div className="flex flex-col gap-4" >
            <div className="flex flex-row items-center justify-between" >
                <div>
                    {/* <ToggleButton /> */}
                </div>
            </div>

            <div className="flex px-4 flex-col items-center justify-center" >
                <FixtureTeamSelector
                    fixture={fixture}
                    className="w-full"
                    value={team}
                    onChange={setTeam}
                />
            </div>

            {team && <TeamRosterPitchView
                team={team}
                fixture={fixture}
            />}

        </div>
    )
}

type TeamRosterProps = {
    team: IProTeam,
    fixture: IFixture
}

function TeamRosterPitchView({ team, fixture }: TeamRosterProps) {

    const { rosters, isLoading } = useGameRosters(fixture);

    const teamRoster = useMemo(() => {
        return rosters.filter((r) => {
            return r.team_id === team.athstat_id
        })
    }, [rosters, team.athstat_id]);

    const getByJersey = useCallback((jersey: number) => {
        return teamRoster.find((r) => r.player_number === jersey);
    }, [teamRoster]);

    if (isLoading) {
        return (
            <div className="mt-4 relative animate-pulse" >
                <RugbyPitch3D className="max-h-[500px]" />
            </div>
        )
    }

    return (
        <div className="mt-4 relative" >
            
            <RugbyPitch3D className="max-h-[500px]" />

            <div className="absolute mt-2 w-full  top-0 left-0 flex flex-col gap-2" >
                <div className="flex w-full flex-row items-center justify-center gap-3" >
                    <RosterItem
                        item={getByJersey(1)}
                    />

                    <RosterItem
                        item={getByJersey(2)}
                    />

                    <RosterItem
                        item={getByJersey(3)}
                    />
                </div>

                <div className="flex w-full flex-row items-center justify-center gap-4" >
                    <RosterItem
                        item={getByJersey(6)}
                    />

                    <RosterItem
                        item={getByJersey(4)}
                    />

                    <div className="mt-4" >
                        <RosterItem
                            item={getByJersey(8)}
                        />
                    </div>

                    <RosterItem
                        item={getByJersey(5)}
                    />


                    <RosterItem
                        item={getByJersey(7)}
                    />
                </div>

                <div className="flex w-full flex-row items-center justify-center gap-4" >


                    <RosterItem
                        item={getByJersey(10)}
                    />

                    <div className="mb-6" >
                        <RosterItem
                            item={getByJersey(9)}
                        />
                    </div>

                    <RosterItem
                        item={getByJersey(12)}
                    />
                </div>

                <div className="flex w-full flex-row items-center justify-center gap-4" >
                    <RosterItem
                        item={getByJersey(11)}
                    />

                    <RosterItem
                        item={getByJersey(13)}
                    />

                    <div className="mt-6" >
                        <RosterItem
                            item={getByJersey(15)}
                        />
                    </div>

                    <RosterItem
                        item={getByJersey(14)}
                    />
                </div>
            </div>
        </div>
    )
}

type RosterItemProps = {
    item?: IRosterItem
}

function RosterItem({ item }: RosterItemProps) {
    return (
        <div>
            {item && <div className="flex flex-col items-center justify-center" >

                <Activity mode={item.athlete.image_url ? "visible" : "hidden"} >
                    <PlayerMugshot
                        url={item.athlete.image_url}
                        teamId={item.team_id}
                    />
                </Activity>

                <Activity mode={item.athlete.image_url ? "hidden" : "visible"} >
                    <div className="max-w-16 bg-green-600 max-h-16 min-w-16 min-h-16 flex flex-col items-center rounded-full overflow-hidden border-2 dark:border-green-500/20 " >
                        <TeamJersey
                            teamId={item.athlete.team_id}
                            className="w-full max-h-15 max-w-15 min-h-15 min-w-15 object-center mt-3 h-full"
                            hideFade
                        />
                    </div>
                </Activity>

                <p className="text-[10px] font-medium" >{item.player_number}. {item.athlete.athstat_firstname}</p>
            </div>}
        </div>
    )
}