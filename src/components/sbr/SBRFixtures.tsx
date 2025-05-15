import { useFetch } from "../../hooks/useFetch"
import { sbrService } from "../../services/sbrService"
import { ISbrFixture } from "../../types/sbr";
import { LoadingState } from "../ui/LoadingState";
import SbrFixtureCard from "./SbrFixtureCard";

export default function SBRFixtures() {

    const { data, isLoading, error } = useFetch("sbr-fixtures", [], () => sbrService.getAllMatches());

    const fixtures = data ?? [];

    

    return (
        <div className="flex flex-col gap-3" >
            <div>
                <h1 className="text-xl font-medium" >Fixtures {!isLoading && "- Round 1"}</h1>
            </div>

            {isLoading && <LoadingState />}

            <div className="grid grid-cols-1 gap-3" >
                {fixtures.map((fixture, index) => {
                    return <SbrFixtureCard
                        fixture={fixture}
                        key={index}
                    />
                })}
            </div>
        </div>
    )
}


function summerizeSbrFixtures (fixtures: ISbrFixture[]) {
    let firstMatch;
    let lastMatch;
    
}