import { ISbrFixture } from "../../../types/sbr"
import SbrFixtureStatsStatusCard from "./SbrFixtureStatsStatusCard"

type Props = {
    showCompetition?: boolean,
    fixture: ISbrFixture
}

/** Renders an SBR Fixture Card Header */
export default function SbrFixtureCardHeader({showCompetition, fixture} : Props) {
    return (
        <div>
            <div className="text-center w-full flex flex-col items-center justify-center text-xs text-slate-700 dark:text-slate-400">
                {showCompetition && fixture.season && <p className="text-[10px]">{fixture.season}</p>}
            </div>

            <SbrFixtureStatsStatusCard fixture={fixture} />
        </div>
    )
}
