import { useEffect } from "react";
import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker"
import SearchBar from "../team-creation/player-selection-components/SearchBar";
import PlayerPickerTeamFilterRow from "./PlayerPickerTeamFilterRow";

export default function PlayerPickerHeader() {

    const {searchQuery, setSearchQuery} = usePlayerPicker();

    useEffect(() => {
        return () => {
            setSearchQuery(undefined);
        }
    }, []);

    return (
        <div className="flex flex-col gap-2" >
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
