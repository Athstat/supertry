import { ArrowLeft, Filter } from "lucide-react";
import PageView from "../../components/ui/containers/PageView";
import { LoadingIndicator } from "../../components/ui/LoadingIndicator";
import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons";
import { useSuggestedLeagues } from "../../hooks/leagues/useSuggestedLeagues";
import CircleButton from "../../components/ui/buttons/BackButton";
import { useNavigateBack } from "../../hooks/web/useNavigateBack";
import { JoinLeagueCard } from "../../components/fantasy-leagues/card/JoinLeagueCard";
import SearchInput from "../../components/ui/forms/SearchInput";
import { useState } from "react";
import { useDebounced } from "../../hooks/web/useDebounced";
import { useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";
import FantasyLeaguesFilter from "../../components/fantasy-leagues/FantasyLeaguesFilter";
import { FantasyLeagueFilterField, FantasyLeaguesSortField } from "../../types/fantasyLeague";

/** Renders screen to discover public leagues */
export default function DiscoverLeaguesScreen() {

    const {hardPop} = useNavigateBack();
    useHideTopNavBar();

    const [searchQuery, setSearchQuery] = useState<string>();
    const debouncedSearchQuery = useDebounced(searchQuery, 500);

    const { selectedSeason } = useFantasySeasons();
    const { joinableLeagues: leagues, isLoading } = useSuggestedLeagues(selectedSeason?.id);

    const [sortField, setSortField] = useState<FantasyLeaguesSortField | undefined>("size");
    const [filterField, setFilterField] = useState<FantasyLeagueFilterField | undefined>(undefined);

    const [isOpen, setOpen] = useState<boolean>(false);
    const toggle = () => setOpen(prev => !prev);

    const filteredLeagues = leagues.filter((l) => {
        if (debouncedSearchQuery) {
            return l.title?.toLowerCase().startsWith(debouncedSearchQuery.toLowerCase())
        }

        return true;
    }).filter((l) => {

        if (filterField === "official") {
            return l.type === "official_league" || l.type === "system_created";
        }

        if (filterField === "user_created") {
            return l.type === "user_created";
        }

        return true;
    }).sort((a,b) => {
        if (sortField === "name") {
            return a.title?.localeCompare(b?.title || '') || 0;
        }

        if (sortField === "size") {
            return (b.members_count || 0) - (a.members_count || 0);
        }

        return 0;
    });

    const handleGoBack = () => {
        hardPop('/leagues');
    }

    if (isLoading) {
        return <LoadingIndicator />
    }

    return (
        <PageView className="px-4 flex flex-col gap-4 py-4" >

            <div className="flex flex-row items-center justify-between gap-2" >
                <div className="flex flex-row items-center gap-4" >
                    
                    <CircleButton className="w-8 h-8" onClick={handleGoBack} >
                        <ArrowLeft className="" />
                    </CircleButton>

                    <h1 className="text-xl font-bold" >Leagues</h1>

                </div>

                <button onClick={toggle} >
                    <Filter />
                </button>
            </div>

            <div>
                <SearchInput
                    placeholder="Search public leagues..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

            <div className="flex flex-col gap-2" >
                {filteredLeagues.map((l) => {
                    return (
                        <JoinLeagueCard 
                            leagueGroup={l}
                            key={l.id}
                        />
                    )
                })}
            </div>

            <FantasyLeaguesFilter 
                isOpen={isOpen}
                sortField={sortField}
                filterField={filterField}
                setFilterField={setFilterField}
                setSortField={setSortField}
                onClose={toggle}
            />
        </PageView>
    )
}
