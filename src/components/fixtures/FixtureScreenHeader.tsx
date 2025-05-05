import { twMerge } from "tailwind-merge";
import { useSticky } from "../../hooks/useSticky";
import { IFixture } from "../../types/games";
import { Sticky } from "../shared/Sticky";

type Props = {
    fixture: IFixture
}

export function FixtureScreenHeader({fixture} : Props) {
    const { isSticky, sentinelRef } = useSticky<HTMLDivElement>();

    return (
        <Sticky ref={sentinelRef} className={twMerge()}  >
            {isSticky && <div>
                <p>{fixture.home_team} vs {fixture.away_team}</p>
            </div>}
        </Sticky>
    )
}
