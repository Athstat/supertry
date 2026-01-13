import { Binoculars, X } from "lucide-react"
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot"
import MatchPrCard from "../../rankings/MatchPrCard"
import CircleButton from "../../ui/buttons/BackButton"
import SecondaryText from "../../ui/typography/SecondaryText"
import { IProAthlete } from "../../../types/athletes"
import { SingleMatchPowerRanking } from "../../../types/powerRankings"
import QuickActionButton from "../../ui/buttons/QuickActionButton"
import { usePlayerSeasonTeam } from "../../../hooks/seasons/useSeasonTeams"

type Props = {
    player: IProAthlete,
    onClose?: () => void,
    powerRanking?: SingleMatchPowerRanking,
    hideViewPlayerProfile?: boolean,
    onViewPlayerProfile?: () => void
}

/** Renders the header component on the player fixture modal */
export default function FixtureModalHeader({player, onClose, powerRanking, hideViewPlayerProfile, onViewPlayerProfile} : Props) {
    
    const {seasonTeam, playerImageUrl} = usePlayerSeasonTeam(player);

    const handleClose = () => {
        if (onClose) {
            onClose();
        }
    }

    const handleViewPlayerProfile = () => {
        if (onViewPlayerProfile) {
            onViewPlayerProfile();
        }
    }
     
    return (
        <div className="flex flex-col" >
            <div className="flex py-2 flex-row items-center justify-between " >

                <div className="flex flex-row items-center gap-2" >
                    <Binoculars />
                    <p>Match Performance Overview</p>
                </div>

                <div>
                    <CircleButton
                        onClick={handleClose}
                    >
                        <X className="w-4 h-4" />
                    </CircleButton>
                </div>
            </div>


            <div className="flex mt-2 flex-row items-center justify-between" >

                <div className="flex flex-row items-center gap-2" >

                    <div>
                        <SmartPlayerMugshot
                            url={playerImageUrl}
                            teamId={seasonTeam?.athstat_id}
                            playerImageClassName="w-16 h-16"
                            jerseyClassName="min-w-14 min-h-20 mt-3"
                            jerseyConClassName="min-w-16 min-h-16"
                            useJerseyBaseclass={false}
                        />
                    </div>

                    <div className="flex flex-col gap-0.5" >
                        <p>{player.player_name}</p>
                        <SecondaryText>{player.team?.athstat_name}</SecondaryText>
                    </div>
                </div>

                <div className="flex flex-col items-end justify-center gap-2" >

                    <MatchPrCard
                        pr={powerRanking?.updated_power_ranking}
                    />

                    <SecondaryText className="text-wrap text-center text-xs" >Match Rating</SecondaryText>
                </div>
            </div>

            <div className="mt-3" >
                {!hideViewPlayerProfile && <QuickActionButton
                    onClick={handleViewPlayerProfile}
                >
                    View Player Profile
                </QuickActionButton>}
            </div>
        </div>
    )
}
