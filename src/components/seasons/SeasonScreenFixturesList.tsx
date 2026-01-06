import { Calendar } from "lucide-react"
import { IFixture } from "../../types/games"
import GroupedFixturesList from "../fixtures/GroupedFixturesList"
import PillBar, { PillBarItems } from "../ui/bars/PillTabBar"
import { useQueryState } from "../../hooks/web/useQueryState"
import NoContentCard from "../ui/typography/NoContentMessage"

type Props = {
    fixtures: IFixture[]
}

/** Renders Season Fixtures */
export default function SeasonScreenFixturesList({ fixtures }: Props) {

    const [round] = useQueryState('round');
    let rounds: number[] = [];

    fixtures.forEach((f) => {
        if (f.round && !rounds.includes(f.round)) {
            rounds.push(f.round);
        }
    })

    rounds.sort((a, b) => a - b);

    const pillItems: PillBarItems[] = rounds.map((r) => {
        return {
            label: `Round ${r}`,
            key: `${r}`
        }
    })

    const filteredFixtures = [...fixtures].filter((f) => {

        if (round === "all" || round === undefined) {
            return true;
        }

        if (f.round && round) {
            if (String(f.round) === round) {
                return true;
            }
        }

        return false

    }).sort((a, b) => {
        const aE = new Date(a.kickoff_time ?? new Date());
        const bE = new Date(b.kickoff_time ?? new Date());

        return bE.valueOf() - aE.valueOf();
    });

    return (
        <div className="flex flex-col gap-2" >
            <div className="flex flex-row items-center gap-2" >
                <Calendar />
                <h1 className="text-lg font-bold" >Fixtures</h1>
            </div>

            {/* Round Filtering */}
            <div className="flex flex-row items-center gap-2 overflow-x-auto " >
                <PillBar
                    items={pillItems}
                    searchParam={'round'}
                />
            </div>

            <div className="grid grid-cols-1 gap-2" >
                <GroupedFixturesList
                    fixtures={filteredFixtures}
                />
            </div>

            {fixtures.length === 0 && (
                <NoContentCard
                    message="No Fixutes were found"
                />
            )}
        </div>
    )
}
