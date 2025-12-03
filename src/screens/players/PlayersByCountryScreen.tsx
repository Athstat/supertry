import { useNavigate, useParams } from "react-router-dom";
import PageView from "../PageView";
import { useSupportedAthletes } from "../../hooks/athletes/useSupportedAthletes";
import { getCountryEmojiFlag } from "../../utils/svrUtils";
import { useMemo, useState } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import RoundedCard from "../../components/shared/RoundedCard";
import PlayersCountrySheet from "../../components/players/nationality/PlayersCountrySheet";
import CircleButton from "../../components/shared/buttons/BackButton";
import PlayersList from "../../components/players/PlayersList";


export default function PlayersByCountryScreen() {

    const { countryName } = useParams<{ countryName: string }>();
    const { athletes } = useSupportedAthletes();
    const navigate = useNavigate();

    const [showSheet, setShowSheet] = useState<boolean>(false);
    const toggle = () => setShowSheet(prev => !prev);

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

            <div className="flex flex-row items-center justify-between gap-1" >

                <div className="flex flex-row items-center gap-2" >
                    <CircleButton
                        onClick={handleBack}
                    >
                        <ArrowLeft />
                    </CircleButton>

                    <p className="font-bold" >Players by Country</p>
                </div>


                <div onClick={toggle} className="flex cursor-pointer flex-row items-center gap-2" >
                    <RoundedCard className="flex rounded-md w-fit dark:border-none cursor-pointer px-4 py-1  flex-row items-center gap-2" >
                        <p className="text-xl" >{flag}</p>
                        <p className="text-sm" >{countryName}</p>
                        <ChevronDown className="w-4 h-4" />
                    </RoundedCard>
                </div>

            </div>

            <PlayersList 
                players={countryAthletes}
            />

            <PlayersCountrySheet
                isOpen={showSheet}
                onClose={toggle}
            />
        </PageView>
    )
}
