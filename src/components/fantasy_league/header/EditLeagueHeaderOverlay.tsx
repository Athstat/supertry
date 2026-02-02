import { useFantasyLeagueScreen } from "../../../hooks/fantasy/useFantasyLeagueScreen";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup"

/** Renders an overlay put on top of the league banner for the user to edit it */
export default function EditLeagueHeaderOverlay() {

    const {isCommissioner, league} = useFantasyLeagueGroup();
    const showOverlay = isCommissioner && !league?.banner;

    const {toggleEditBanner} = useFantasyLeagueScreen();
    
    if (!showOverlay) {
        return null;
    }

    const handleClick = () => {
        toggleEditBanner();
    }

    return (
        <div 
            className="absolute top-0 left-0 cursor-pointer w-full h-full p-4 flex flex-col items-center justify-center" 
            onClick={handleClick}
        >
        </div>
    )
}
