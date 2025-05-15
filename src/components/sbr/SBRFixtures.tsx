import { ArrowRight } from "lucide-react";
import { sbrService } from "../../services/sbrService"
import { LoadingState } from "../ui/LoadingState";
import SbrFixtureCard from "./SbrFixtureCard";
import SbrVotingModal from "./SbrVotingModal";
import useSWR from "swr";
import { useState } from "react";

export default function SBRFixtures() {

    const { data, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllMatches());

    const fixtures = data ?? [];
    const [showVoting, setShowVoting] = useState(false);
    const toogle = () => setShowVoting(!showVoting);

    return (
        <div className="flex flex-col gap-3" >

            {fixtures.length > 0 &&
                <div className="w-full rounded-xl p-5 bg-gradient-to-br flex flex-col gap-3 dark:from-blue-700 from-blue-600 to-blue-800 text-white dark:to-blue-950" >
                    <h1 className="text-xl font-bold" >ZIM SBR Week 1 🇿🇼</h1>
                    <p className="text-md font-medium text-slate-200" >It's SBR Week 1, Place your vote in, for who you got winning this week!</p>
                    <button onClick={toogle} className="bg-white flex flex-row gap-2 hover:bg-slate-200 items-center justify-center lg:w-[40%] py-3 font-bold text-md text-blue-500 rounded-xl" >
                        Vote Now
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            }

            <div>
                <h1 className="text-xl font-medium" >Fixtures {!isLoading && "- Round 1"}</h1>
                <div>

                </div>
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

            { fixtures.length > 0 && !isLoading && 
                <SbrVotingModal  
                    fixtures={fixtures}
                    open={showVoting}
                    onClose={toogle}
                />
            }
        </div>
    )
}