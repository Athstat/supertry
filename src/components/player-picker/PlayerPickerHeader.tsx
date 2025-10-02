import { useEffect } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker"
import SearchBar from "../team-creation/player-selection-components/SearchBar";
import PlayerPickerTeamFilterRow from "./PlayerPickerTeamFilterRow";
import BlueGradientCard from "../shared/BlueGradientCard";
import { twMerge } from "tailwind-merge";

export default function PlayerPickerHeader() {

    const { searchQuery, setSearchQuery, maxPrice } = usePlayerPicker();

    useEffect(() => {
        return () => {
            setSearchQuery(undefined);
        }
    }, []);

    return (
        <div className="flex flex-col gap-2" >

            <BlueGradientCard
                className={twMerge(
                    "flex flex-row items-center justify-center  py-2",
                    "from-blue-600 to-purple-700"
                )}
            >
                <p className="text-sm font-medium" >Budget ${maxPrice}</p>
            </BlueGradientCard>

            <div className="flex rounded-xl flex-row items-center gap-2 w-full" >
                {/* <InputField 
                    className="w-full " 
                    inputCn="focus:ring-transparent"
                /> */}

                <SearchBar
                    className="w-full"
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholder="Search by Name"
                />
            </div>

            <PlayerPickerTeamFilterRow />
        </div>
    )
}
