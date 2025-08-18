import { Loader } from "lucide-react";
import LeagueFilterPanel, { AccessType, CreatorType, DateOrder } from "../LeagueFilterPanel";
import JoinLeagueActiveLeaguesSection from "./JoinLeagueActiveLeaguesSection";
import { swrFetchKeys } from "../../../utils/swrKeys";
import { useState } from "react";
import useSWR from "swr";
import { fantasyLeagueGroupsService } from "../../../services/fantasy/fantasyLeagueGroupsService";
import OfficialLeaguesSection from "./OfficialLeaguesSection";


export default function DiscorverLeaguesTab() {

    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

    const key = swrFetchKeys.getAllDiscorverLeagues();
    const { data: publicLeagues, isLoading, error } = useSWR(key, () => fantasyLeagueGroupsService.getDiscoverLeagues());

    const discoverLeagues = publicLeagues ?? [];

    const [discoverFilters, setDiscoverFilters] = useState<{
        creator: CreatorType;
        access: AccessType;
        date: DateOrder;
    }>({ creator: 'all', access: 'all', date: 'recent' });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Discover Public Leagues
                </h2>
                <button
                    onClick={() => setIsFilterOpen(true)}
                    className="px-3 py-1.5 rounded-lg text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                    Filters
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader className="w-8 h-8 text-primary-500 animate-spin" />
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading leagues...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg text-center">
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200"
                    >
                        Try Again
                    </button>
                </div>
            ) : discoverLeagues.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-base sm:text-lg font-medium mb-2 dark:text-gray-200">
                        No leagues to discover
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your filters.</p>
                </div>
            ) : (
                <>
                    <OfficialLeaguesSection
                        leagues={discoverLeagues}
                    />
                    <JoinLeagueActiveLeaguesSection
                        leagues={discoverLeagues}
                    />
                </>
            )}

            <LeagueFilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                value={discoverFilters}
                onChange={setDiscoverFilters}
            />
        </div>
    )
}
