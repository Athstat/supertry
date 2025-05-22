import GroupedSbrFixturesList from "./GroupSbrFixtureList";
import { ISbrFixture } from "../../../types/sbr";
import { useSbrContext } from "../../../contexts/SbrContext";
import { Swords } from "lucide-react";

type Props = {
    fixtures: ISbrFixture[]
}

export default function SbrCurrentWeekFixtures({fixtures} : Props) {

    const {currentRound} = useSbrContext();

    return (
        <div className="flex flex-col gap-5" >

            <div className="flex flex-row items-center gap-1" >
                <Swords />
                <h1 className="text-xl font-medium" > Week {currentRound} Fixtures </h1>
            </div>

            <GroupedSbrFixturesList
                fixtures={fixtures}
            />
        </div>
    )
}