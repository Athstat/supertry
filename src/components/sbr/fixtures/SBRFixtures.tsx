import { sbrService } from "../../../services/sbrService"
import { LoadingState } from "../../ui/LoadingState";
import useSWR from "swr";
import GroupedSbrFixturesList from "./GroupSbrFixtureList";
import { useSbrContext } from "../../../contexts/SBRContext";
import SbrFixturesHero from "./SbrFixturesHero";

export default function SBRFixtures() {

    const {currentRound} = useSbrContext();
    const { data, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllMatches());


    const fixtures = (data ?? []).filter(f => {
        return f.round === currentRound
    });

    return (
        <div className="flex flex-col gap-5" >

            {fixtures.length > 0 && !isLoading &&
                <SbrFixturesHero 
                    fixtures={fixtures}
                />
            }

            <div>
                <h1 className="text-xl font-medium" >{"Zim & SA Schools Fixtures"}</h1>
            </div>

            {isLoading && <LoadingState />}

            <GroupedSbrFixturesList
                fixtures={fixtures}
            />
        </div>
    )
}