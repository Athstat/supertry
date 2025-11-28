import { Activity, useCallback, useMemo, useState } from "react"
import { IFixture, IRosterItem } from "../../../types/games"
import FixtureTeamSelector from "../boxscore/FixtureTeamSelector"
import { IProTeam } from "../../../types/team"
import { RugbyPitch3D } from "../../shared/RugbyPitch"
import { useGameRosters } from "../../../hooks/fixtures/useGameRosters"
import PlayerMugshot from "../../shared/PlayerMugshot"
import TeamJersey from "../../player/TeamJersey"
import { twMerge } from "tailwind-merge"
import { useAthleteMatchPr } from "../../../hooks/athletes/useAthleteMatchPr"
import { useAtomValue } from "jotai"
import { fixtureAtom } from "../../../state/fixtures/fixture.atoms"
import { SmallMatchPrCard } from "../../rankings/MatchPrCard"
import { useFixtureScreen } from "../../../hooks/fixtures/useFixture"

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

            <div className="flex px-4   flex-col items-center justify-center" >
                <FixtureTeamSelector
                    fixture={fixture}
                    className="w-[70%]"
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

    const hasRosterItems = teamRoster.length >= 15;

    if (isLoading) {
        return (
            <div className="mt-4 relative animate-pulse" >
                <RugbyPitch3D className="max-h-[500px]" />
            </div>
        )
    }

    return (
        <div className="mt-4 relative" >

            <RugbyPitch3D className={twMerge(
                "max-h-[500px] opacity-70",
                !hasRosterItems && "opacity-20"
            )} />

            <Activity mode={hasRosterItems ? "visible" : "hidden"} >
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
            </Activity>

            <Activity mode={hasRosterItems ? "hidden" : "visible"} >
                <div className="w-full h-[300px] flex flex-col items-center justify-center absolute top-0 left-0" >
                    <div>
                        <p>Rosters for {team.athstat_name} are not yet available</p>
                    </div>
                </div>
            </Activity>
        </div>
    )
}

type RosterItemProps = {
    item?: IRosterItem
}

function RosterItem({ item }: RosterItemProps) {

    const {openPlayerMatchModal} = useFixtureScreen();
    const fixture = useAtomValue(fixtureAtom);
    const {pr} = useAthleteMatchPr(item?.athlete.tracking_id, fixture?.game_id);

    const onClick = () => {
        if (item?.athlete) {
            openPlayerMatchModal(item?.athlete);
        }
    }

    return (
        <div
            key={item?.athlete.tracking_id}
            className=""
            onClick={onClick}
        >
            {item && <div className="flex flex-col items-center justify-center relative" >

                <Activity mode={item.athlete.image_url ? "visible" : "hidden"} >
                    <PlayerMugshot
                        url={item.athlete.image_url}
                        teamId={item.team_id}
                        className="border-2 border-green-500 dark:border-green-500/40 bg-green-600 w-16 h-16 hover:bg-green-400"
                    />
                </Activity>

                <Activity mode={item.athlete.image_url ? "hidden" : "visible"} >
                    <div className="max-w-16 bg-green-600 max-h-16 min-w-16 min-h-16 flex flex-col items-center rounded-full overflow-hidden border-2 border-green-200/40 dark:border-green-500/20 " >
                        <TeamJersey
                            teamId={item.athlete.team_id}
                            className="w-full max-h-[60px] max-w-[60px] min-h-[60px] min-w-[60px] object-center mt-3 h-full"
                            hideFade
                        />
                    </div>
                </Activity>

                <p className="text-[10px] text-white font-medium" >{item.player_number}. {item.athlete.athstat_firstname}</p>

                {pr && (
                    <div className="absolute top-0 right-0" >
                        <SmallMatchPrCard 
                            pr={pr.updated_power_ranking}
                        />
                    </div>
                )}
            </div>}
        </div>
    )
}