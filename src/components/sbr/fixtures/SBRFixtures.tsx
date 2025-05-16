import { ChevronRight } from "lucide-react";
import { sbrService } from "../../../services/sbrService"
import { LoadingState } from "../../ui/LoadingState";
import SbrVotingModal from "../voting/SbrVotingModal";
import useSWR from "swr";
import { useState } from "react";
import { format } from "date-fns";
import BlueGradientCard from "../../shared/BlueGradientCard";
import GroupedSbrFixturesList from "./GroupSbrFixtureList";

export default function SBRFixtures() {

    const { data, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllMatches());

    const fixtures = data ?? [];
    const [showVoting, setShowVoting] = useState(false);
    const toogle = () => setShowVoting(!showVoting);

    return (
        <div className="flex flex-col gap-5" >

            {fixtures.length > 0 &&
                <BlueGradientCard className="w-full rounded-xl p-5 bg-gradient-to-br flex flex-col gap-4 lg:p-10" >
                    <h1 className="text-xl lg:text-3xl font-bold" >SBR Week 1 🇿🇼 🇿🇦</h1>
                    <p className="text-md lg:text-lg font-medium text-slate-200" >It's SBR Week 1, Place your vote in, for who you got winning this week!</p>
                    <button onClick={toogle} className="bg-white lg:w-fit text-primary-800 px-4 flex-row justify-center sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2" >
                        Vote Now
                        <ChevronRight size={20} />
                    </button>
                </BlueGradientCard>
            }

            <div>
                <h1 className="text-xl font-medium" >{"Zim & SA Schools Fixtures"}</h1>
                <div>

                </div>
            </div>

            {isLoading && <LoadingState />}

            <GroupedSbrFixturesList 
                fixtures={fixtures}
            />

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