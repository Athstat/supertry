import { useEffect, useState } from "react";
import { useProFixtures } from "../../hooks/fixtures/useProFixtures"
import { FixtureListViewMode, IFixture } from "../../types/games";
import { searchProFixturePredicate } from "../../utils/fixtureUtils";
import NoContentCard from "../shared/NoContentMessage";
import { LoadingIndicator } from "../ui/LoadingIndicator";
import GroupedFixturesList from "./GroupedFixturesList";

type Props = {
    searchQuery?: string,
    viewMode: FixtureListViewMode
}

/** Renders a fixture search results component, and handles fetches the matches too */
export default function FixtureSearchResults({ searchQuery, viewMode }: Props) {

    const { fixtures, isLoading } = useProFixtures();
    const [isProcessing, setProcessing] = useState(false);

    const [results, setResults] = useState<IFixture[]>([]);

    useEffect(() => {

        if (isLoading) {
            return;
        }

        const fetcher = async () => {
            setProcessing(true);

            setResults(() => {
                return fixtures.filter((f) => {
                    return searchQuery ? searchProFixturePredicate(searchQuery, f) : false;
                });
            })

            setProcessing(false);
        }

        fetcher();

    }, [fixtures, isLoading, searchQuery]);

    const isBuffering = isLoading || isProcessing;
    const hasAnyFixtures = results.length > 0;

    return (
        <div>

            {results.length === 0 && searchQuery && (
                <NoContentCard message="No fixtures match your search" />
            )}

            {isBuffering && (
                <div>
                    <LoadingIndicator />
                </div>
            )}

            {!isBuffering && hasAnyFixtures && (
                <GroupedFixturesList 
                    fixtures={results}
                    viewMode={viewMode}
                />
            )}

        </div>
    )
}
