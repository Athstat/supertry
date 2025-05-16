import { format } from "date-fns";
import { useSticky } from "../../hooks/useSticky";
import { IFixture } from "../../types/games";
import { fixtureSumary } from "../../utils/fixtureUtils";
import { Sticky } from "../shared/Sticky";
import TeamLogo from "../team/TeamLogo";

type Props = {
    fixture: IFixture
}

export function FixtureScreenHeader({ fixture }: Props) {
    const { isSticky, sentinelRef } = useSticky<HTMLDivElement>();

    const {gameKickedOff} = fixtureSumary(fixture);

    return (
        <>
            <div ref={sentinelRef} />
            {isSticky && <Sticky className={""}  >
                
                <div className="flex z-30 flex-row w-full items-center shadow-lg shadow-black/10 dark:shadow-black justify-center py-2 lg:px-[15%] bg-white dark:bg-black/40 h-16" >
                    
                    <div className="flex-1 flex flex-row items-center justify-between "  >
                        <TeamLogo className="h-10 w-10" url={fixture.team_image_url} />
                        <p  className="text-md font-bold"  >{fixture.team_score}</p>
                    </div>

                    <div className="flex-[3] dark:text-slate-300 text-slate-700 flex flex-row items-center justify-center " >
                        {gameKickedOff && <p>Final</p>}
                        {!gameKickedOff && fixture.kickoff_time && <p>{format(fixture.kickoff_time, "hh:mm a")}</p>}
                    </div>

                    <div className="flex-1 flex flex-row items-center justify-between " >
                        <p className="text-md font-bold" >{fixture.opposition_score}</p>
                        <TeamLogo className="h-10 w-10" url={fixture.opposition_image_url} />
                    </div>
                </div>
            </Sticky>}
        </>
    )
}
