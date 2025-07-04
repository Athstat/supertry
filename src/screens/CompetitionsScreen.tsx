import { Trophy } from "lucide-react";
import PageView from "./PageView";
import useSWR from "swr";
import { seasonService } from "../services/seasonsService";
import { LoadingState } from "../components/ui/LoadingState";
import SeasonCard from "../components/seasons/SeasonCard";
import NoContentCard from "../components/shared/NoContentMessage";

/** Renders Competition Screen */
export default function CompetitionsScreen() {

    let { data: seasons, isLoading } = useSWR('seasons', () => seasonService.getAllSupportedSeasons());

    if (isLoading) return <LoadingState />

    seasons = seasons ?? [];

    return (
        <PageView className="p-4 flex flex-col gap-4" >
            <div className="flex flex-row items-center gap-2 " >
                <Trophy className="" />
                <p className="text-xl font-bold" >Competitions</p>
            </div>

            {seasons && (
                <div className="flex flex-col gap-2" >
                    {seasons.map((s, index) => {
                        return <SeasonCard
                            season={s}
                            key={index}
                        />
                    })}
                </div>
            )}

            {seasons.length === 0 && (
                <div>
                    <NoContentCard
                        message="No competitions were found"
                    />
                </div>
            )}

        </PageView>
    )
}