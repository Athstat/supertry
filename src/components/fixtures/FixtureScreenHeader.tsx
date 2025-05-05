import { useSticky } from "../../hooks/useSticky";
import { IFixture } from "../../types/games";
import { Sticky } from "../shared/Sticky";

type Props = {
    fixture: IFixture
}

export function FixtureScreenHeader({ fixture }: Props) {
    const { isSticky, sentinelRef } = useSticky<HTMLDivElement>();

    return (
        <>
            <div ref={sentinelRef} /> 
            {isSticky && <Sticky className={"dark:bg-black"}  >
                {<div className="flex z-30 flex-row w-full bg-white dark:bg-gray-800/60 h-16" >
                    <p>{fixture.home_team} vs {fixture.away_team}</p>
                </div>}
            </Sticky>}
        </>
    )
}
