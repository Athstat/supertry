import { userRankingsService } from "../../services/userRankingsService";
import { ArrowUp, ArrowDown } from "lucide-react";
import UserRankingFocusShort from "./UserRankingFocusShort";
import { LoadingState } from "../ui/LoadingState";
import UserRankingsItem from "./UserRankingsItem";
import { useFetch } from "../../hooks/useFetch";

export default function UserRankingsLeaderBoard() {

    const {data: rankings, isLoading, error} = useFetch(
        "rankings",[],
        async () => await userRankingsService.getUserRankings()
    );

    console.log("Errors ", error);
    
    if (isLoading) return <LoadingState  />

    if (!rankings) return;

    let shortList = rankings ?? [];

    shortList = shortList.slice(0, 15);

    return (
        <div>
            <div className="rounded-2xl shadow-sm overflow-hidden">
                <div className="">
                    {shortList.map((user, index) => (

                        <>
                            {index === 5 && (
                                <div className="px-4 py-2">
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center justify-center gap-2">
                                        <ArrowUp className="w-4 h-4 stroke-[3]" />
                                        Promotion Zone
                                        <ArrowUp className="w-4 h-4 stroke-[3]" />
                                    </p>
                                </div>
                            )}
                            {index === 10 && (
                                <div className="px-4 py-2">
                                    <p className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center justify-center gap-2">
                                        <ArrowDown className="w-4 h-4 stroke-[3]" />
                                        Demotion Zone
                                        <ArrowDown className="w-4 h-4 stroke-[3]" />
                                    </p>
                                </div>
                            )}
                            
                            <UserRankingsItem userRank={user} index={index} />
                        </>
                    ))}
                </div>
            </div>

            <UserRankingFocusShort rankings={rankings} />

            {/* Bottom Section */}
            <div className="mt-6 space-y-4 mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Rankings are refreshed every hour
                </p>
            </div>
        </div>
    )
}
