import { twMerge } from "tailwind-merge";
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
        <div className={twMerge(
            "w-full items-center justify-center text-[10px] lg:text-sm text-gray-600 dark:text-slate-400 flex flex-row gap-1",
            "text-[#011E5C] dark:text-slate-200"
        )}>
            
            {showCompetition && competition_name && round && (
                <>
                    <p className="font-medium">
                        {competition_name} |
                    </p>

                    <p>Round 1{round} |</p>
                </>
            )}

            {showVenue && (
                <p className="">{venue}</p>
            )}
        </div>
    )
}
