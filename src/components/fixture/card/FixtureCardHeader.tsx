import { twMerge } from "tailwind-merge";
import { useLiveFixture } from "../../../hooks/fixtures/useLiveFixture";
import { IFixture } from "../../../types/games"
import { abbreviateSeasonName } from "../../../utils/stringUtils";

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

            <div className="flex flex-row items-center gap-1 bg-[#F0F3F7] dark:bg-slate-800 px-2 rounded-full" >
                {showCompetition && competition_name && round && (
                    <>
                        <p className="font-medium">
                            {abbreviateSeasonName(competition_name)} |
                        </p>

                        <p>Round {round} |</p>
                    </>
                )}

                {showVenue && (
                    <p className="">{venue}</p>
                )}
            </div>
        </div>
    )
}
