import { useLiveFixture } from "../../../hooks/fixtures/useLiveFixture";
import { IFixture } from "../../../types/games"

type Props = {
    fixture: IFixture,
    showCompetition?: boolean,
    showVenue?: boolean
}

/** Renders Fixture Card Header */
export default function FixtureCardHeader({ fixture, showCompetition = false, showVenue = false }: Props) {

    const { liveFixture } = useLiveFixture({ fixture });
    const displayFixture = liveFixture || fixture;

    const {
        competition_name,
        round,
        venue,
    } = displayFixture;

    return (
        <div className="w-full items-center justify-center flex flex-col">
            {showCompetition && competition_name && (
                <p className="text-[10px] lg:text-sm text-gray-600 dark:text-slate-400">
                    {competition_name}
                    {round !== null ? `, Week ${round}` : ''}
                </p>
            )}
            {showVenue && (
                <p className="text-[10px] lg:text-sm text-gray-600 dark:text-slate-400">{venue}</p>
            )}
        </div>
    )
}
