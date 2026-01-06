import { useMemo, useCallback, Activity } from "react";
import { twMerge } from "tailwind-merge";
import { useGameRosters } from "../../../../hooks/fixtures/useGameRosters";
import { IFixture } from "../../../../types/games";
import { IProTeam } from "../../../../types/team";
import { RugbyPitch3DRaster } from "../../../shared/RugbyPitch";
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
                <RugbyPitch3DRaster className="max-h-[500px]" />
            </div>
        )
    }

    return (
        <div className="mt-4 relative" >

            <RugbyPitch3DRaster className={twMerge(
                "max-h-[720px] lg:max-h-[800px] dark:opacity-60",
                !hasRosterItems && "opacity-20"
            )} />

            <Activity mode={hasRosterItems ? "visible" : "hidden"} >
                <div className="absolute mt-8 w-full  top-0 left-0 flex flex-col gap-2" >
                    <div className="flex w-full flex-row items-center justify-center gap-6" >
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

                    <div className="flex w-full flex-row items-center justify-center gap-6" >
                        <RosterStarterItem
                            item={getByJersey(4)}
                        />

                        <RosterStarterItem
                            item={getByJersey(5)}
                        />
                    </div>

                    <div className="flex relative w-full flex-row items-center justify-center gap-6" >

                        <RosterStarterItem
                            item={getByJersey(6)}
                            className=""
                        />

                        <RosterStarterItem
                            item={getByJersey(8)}
                            className="top-5"
                        />

                        <RosterStarterItem
                            item={getByJersey(7)}
                            className=""
                        />
                    </div>

                    <div className="flex mt-4 relative w-full flex-row items-center justify-center gap-6" >

                        <RosterStarterItem
                            item={getByJersey(9)}
                            className=""
                        />

                        <RosterStarterItem
                            item={getByJersey(10)}
                            className="top-4"
                        />

                        <RosterStarterItem
                            item={getByJersey(12)}
                            className="top-8"
                        />

                        <RosterStarterItem
                            item={getByJersey(13)}
                            className="top-12"
                        />

                        <RosterStarterItem
                            item={getByJersey(14)}
                            className="top-16"
                        />

                    </div>

                    <div className="flex mt-6 relative w-full flex-row items-center justify-between" >

                        <div className="flex flex-1 item justify-center" >
                            <RosterStarterItem
                                item={getByJersey(11)}
                                className="lg:left-28"
                            />
                        </div>

                        <div className="flex flex-1 item justify-center" >
                            <RosterStarterItem
                                item={getByJersey(15)}
                                className="top-8"
                            />
                        </div>

                        <div className="flex flex-1 item justify-center" >
                            <RosterStarterItem
                                item={getByJersey(14)}
                                className="-top-8 hidden left-4"
                            />
                        </div>

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

