import { useParams } from "react-router-dom";
import useSWR from "swr";
import { gamesService } from "../services/gamesService";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";

export default function FixtureScreen() {

    const { fixtureId } = useParams();
    const {data: fixture, isLoading, error} = useSWR(fixtureId, gamesService.getGameById);

    if (isLoading) return <LoadingState message="" />

    if (error) {
        return <ErrorState message="Error loading fixture" /> 
    }

  return (
    <div className="dark:text-white p-3" >
        {fixtureId}
        {JSON.stringify(fixture)}
    </div>
  )
}
