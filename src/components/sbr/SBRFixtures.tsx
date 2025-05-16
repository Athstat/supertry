import { ArrowRight, ChevronRight } from "lucide-react";
import { sbrService } from "../../services/sbrService"
import { LoadingState } from "../ui/LoadingState";
import SbrFixtureCard from "./SbrFixtureCard";
import SbrVotingModal from "./SbrVotingModal";
import useSWR from "swr";
import { useState } from "react";
import { format } from "date-fns";
import BlueGradientCard from "../shared/BlueGradientCard";

export default function SBRFixtures() {

    const { data, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllMatches());

    const fixtures = data ?? [];
    const [showVoting, setShowVoting] = useState(false);
    const toogle = () => setShowVoting(!showVoting);

    const dateStr = fixtures.length > 0 ? 
        fixtures[0].kickoff_time ? format(fixtures[0].kickoff_time, "EE dd MMMM yyyy") : ""
        : "";

    return (
        <div className="flex flex-col gap-3" >

            {fixtures.length > 0 &&
                <BlueGradientCard className="w-full rounded-xl p-5 bg-gradient-to-br flex flex-col gap-4 lg:p-10" >
                    <h1 className="text-xl lg:text-3xl font-bold" >ZIM SBR Week 1 🇿🇼</h1>
                    <p className="text-md lg:text-lg font-medium text-slate-200" >It's SBR Week 1, Place your vote in, for who you got winning this week!</p>
                    <button onClick={toogle} className="bg-white lg:w-fit text-primary-800 px-4 flex-row justify-center sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2" >
                        Vote Now
                        <ChevronRight size={20} />
                    </button>
                </BlueGradientCard>
            }

            <div>
                <h1 className="text-xl font-medium" >Fixtures {!isLoading && "- Round 1"}</h1>
                <p className="text dark:text-slate-400 text-slate-700" >{dateStr}</p>
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