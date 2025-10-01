import { usePlayerPicker } from "../../hooks/playerPicker/usePlayerPicker"
import SearchBar from "../team-creation/player-selection-components/SearchBar";

export default function PlayerPickerHeader() {

    const {searchQuery, setSearchQuery} = usePlayerPicker();

    return (
        <div>
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
        </div>
    )
}
