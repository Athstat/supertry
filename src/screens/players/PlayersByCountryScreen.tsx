import { useParams } from "react-router-dom";
import PageView from "../PageView";
import { useSupportedAthletes } from "../../hooks/athletes/useSupportedAthletes";
import { getCountryEmojiFlag } from "../../utils/svrUtils";
import { Activity, useMemo } from "react";
import SearchInput from "../../components/shared/forms/SearchInput";
import { useQueryState } from "../../hooks/useQueryState";
import PlayerSearchResults from "./PlayerSearchResults";
import { PlayerGameCard } from "../../components/player/PlayerGameCard";
import { Users } from "lucide-react";
import RoundedCard from "../../components/shared/RoundedCard";


export default function PlayersByCountryScreen() {

    const { countryName } = useParams<{ countryName: string }>();
    const { athletes } = useSupportedAthletes();


    const [searchQuery, setSearchQuery] = useQueryState<string | undefined>('query');


    const flag = getCountryEmojiFlag(countryName);

    const countryAthletes = useMemo(() => {
        return athletes.filter((a) => {
            return a.nationality?.startsWith(countryName || "");
        });
    }, [countryName, athletes]);




    return (
        <PageView className="px-4 flex flex-col gap-4" >

            <div className="flex flex-row items-center gap-2" >

                <div className="flex flex-row items-center gap-2" >
                    <Users />
                    <p>Players</p>
                </div>

                <RoundedCard className="flex dark:border-none cursor-pointer dark:bg-slate-800 px-2 rounded-xl flex-row items-center gap-2" >
                    <p className="text-xl" >{flag}</p>
                    <p className="text-sm" >{countryName}</p>
                </RoundedCard>
            </div>

            <div>
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                />
            </div>

            <Activity mode={searchQuery ? "visible" : "hidden"} >
                <PlayerSearchResults
                    searchQuery={searchQuery}
                    playerPool={countryAthletes}
                />
            </Activity>

            <Activity mode={searchQuery ? "hidden" : "visible"} >
                <div className="flex w-full justify-center flex-row items-center gap-2 flex-wrap" >
                    {countryAthletes.map((a) => {
                        return (
                            <PlayerGameCard
                                player={a}
                            />
                        )
                    })}
                </div>
            </Activity>
        </PageView>
    )
}
