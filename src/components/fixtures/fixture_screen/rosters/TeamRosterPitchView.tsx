import { useMemo, useCallback, Activity } from "react";
import { twMerge } from "tailwind-merge";
import { useGameRosters } from "../../../../hooks/fixtures/useGameRosters";
import { IFixture } from "../../../../types/games";
import { IProTeam } from "../../../../types/team";
import { RugbyPitch3D } from "../../../shared/RugbyPitch";
import { RosterStarterItem } from "./RosterStarterItem";
import FixtureRosterBench from "./FixtureRosterBench";

type TeamRosterProps = {
    team: IProTeam,
    fixture: IFixture
}

export function TeamRosterPitchView({ team, fixture }: TeamRosterProps) {

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

    const rosterBench = useMemo(() => {
        return teamRoster.filter((r) => {
            return r.is_substitute === true;
        })
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

            <RugbyPitch3D className={twMerge(
                "max-h-[500px] dark:opacity-70",
                !hasRosterItems && "opacity-20"
            )} />

            <Activity mode={hasRosterItems ? "visible" : "hidden"} >
                <div className="absolute mt-2 w-full  top-0 left-0 flex flex-col gap-2" >
                    <div className="flex w-full flex-row items-center justify-center gap-3" >
                        <RosterStarterItem
                            item={getByJersey(1)}
                        />

                        <RosterStarterItem
                            item={getByJersey(2)}
                        />

                        <RosterStarterItem
                            item={getByJersey(3)}
                        />
                    </div>

                    <div className="flex w-full flex-row items-center justify-center gap-4" >
                        <RosterStarterItem
                            item={getByJersey(6)}
                        />

                        <RosterStarterItem
                            item={getByJersey(4)}
                        />

                        <div className="mt-4" >
                            <RosterStarterItem
                                item={getByJersey(8)}
                            />
                        </div>

                        <RosterStarterItem
                            item={getByJersey(5)}
                        />


                        <RosterStarterItem
                            item={getByJersey(7)}
                        />
                    </div>

                    <div className="flex w-full flex-row items-center justify-center gap-4" >


                        <RosterStarterItem
                            item={getByJersey(10)}
                        />

                        <div className="mb-6" >
                            <RosterStarterItem
                                item={getByJersey(9)}
                            />
                        </div>

                        <RosterStarterItem
                            item={getByJersey(12)}
                        />
                    </div>

                    <div className="flex w-full flex-row items-center justify-center gap-4" >
                        <RosterStarterItem
                            item={getByJersey(11)}
                        />

                        <RosterStarterItem
                            item={getByJersey(13)}
                        />

                        <div className="mt-6" >
                            <RosterStarterItem
                                item={getByJersey(15)}
                            />
                        </div>

                        <RosterStarterItem
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

            <FixtureRosterBench 
                bench={rosterBench}
            />
        </div>
    )
}

