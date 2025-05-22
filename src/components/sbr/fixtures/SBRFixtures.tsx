import GroupedSbrFixturesList from "./GroupSbrFixtureList";
import SbrFixturesHero from "./SbrFixturesHero";
import { ISbrFixture } from "../../../types/sbr";
import { useSbrContext } from "../../../contexts/SBRContext";

type Props = {
    fixtures: ISbrFixture[]
}

export default function SBRFixtures({fixtures} : Props) {

    const {currentRound} = useSbrContext();

    return (
        <div className="flex flex-col gap-5" >

            {fixtures.length > 0 &&
                <SbrFixturesHero 
                    fixtures={fixtures}
                />
            }

            <div>
                <h1 className="text-xl font-medium" >Week {currentRound} Fixtures </h1>
            </div>

            <GroupedSbrFixturesList
                fixtures={fixtures}
            />
        </div>
    )
}