import { useNavigate, useParams } from "react-router-dom";
import PageView from "../PageView";
import { useSupportedAthletes } from "../../hooks/athletes/useSupportedAthletes";
import { getCountryEmojiFlag } from "../../utils/svrUtils";
import { Activity, useMemo, useState } from "react";
import SearchInput from "../../components/shared/forms/SearchInput";
import { useQueryState } from "../../hooks/useQueryState";
import PlayerSearchResults from "./PlayerSearchResults";
import { PlayerGameCard } from "../../components/player/PlayerGameCard";
import { ArrowLeft, Users } from "lucide-react";
import RoundedCard from "../../components/shared/RoundedCard";
import SecondaryText from "../../components/shared/SecondaryText";
import PlayersCountrySheet from "../../components/players/nationality/PlayersCountrySheet";
import CircleButton from "../../components/shared/buttons/BackButton";


export default function PlayersByCountryScreen() {

    const { countryName } = useParams<{ countryName: string }>();
    const { athletes } = useSupportedAthletes();
    const navigate = useNavigate();

    const [showSheet, setShowSheet] = useState<boolean>(false);
    const toggle = () => setShowSheet(prev => !prev);

    const [searchQuery, setSearchQuery] = useQueryState<string | undefined>('query');


    const flag = getCountryEmojiFlag(countryName);

    const countryAthletes = useMemo(() => {
        return athletes.filter((a) => {
            return a.nationality?.startsWith(countryName || "");
        });
    }, [countryName, athletes]);


    const handleBack = () => {
        navigate("/players");
    }




    return (
        <PageView className="px-4 flex flex-col gap-2" >

            <div className="flex flex-col gap-1" >

                <div className="flex flex-row items-center gap-2" >
                    <CircleButton
                        onClick={handleBack}
                    >
                        <ArrowLeft />
                    </CircleButton>
                    <Users />
                    <p className="font-bold" >Players</p>
                </div>


                <div onClick={toggle} className="flex cursor-pointer flex-row items-center gap-2" >
                    <SecondaryText>Viewing Players for</SecondaryText>
                    <RoundedCard className="flex w-fit dark:border-none cursor-pointer dark:bg-slate-800 px-2 rounded-xl flex-row items-center gap-2" >
                        <p className="text-xl" >{flag}</p>
                        <p className="text-sm" >{countryName}</p>
                    </RoundedCard>
                </div>

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

            <PlayersCountrySheet 
                isOpen={showSheet}
                onClose={toggle}
            />
        </PageView>
    )
}
