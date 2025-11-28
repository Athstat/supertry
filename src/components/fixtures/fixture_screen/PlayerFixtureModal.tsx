import { Activity, useMemo } from "react"
import { IProAthlete } from "../../../types/athletes"
import { IFixture } from "../../../types/games"
import BottomSheetView from "../../ui/BottomSheetView"
import CircleButton from "../../shared/buttons/BackButton"
import { Binoculars, X } from "lucide-react"
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot"
import MatchPrCard from "../../rankings/MatchPrCard"
import { useAthleteMatchPr } from "../../../hooks/athletes/useAthleteMatchPr"
import SecondaryText from "../../shared/SecondaryText"
import { StatCard } from "../../shared/StatCard"
import { swrFetchKeys } from "../../../utils/swrKeys"
import useSWR from "swr"
import { gamesService } from "../../../services/gamesService"
import { LoadingState } from "../../ui/LoadingState"

type Props = {
    fixture: IFixture,
    player: IProAthlete,
    onClose?: () => void,
    isOpen?: boolean
}

export default function PlayerFixtureModal({ fixture, player, onClose, isOpen }: Props) {

    const { pr, isLoading: loadingPr } = useAthleteMatchPr(player.tracking_id, fixture.game_id);

    const key = swrFetchKeys.getAthleteFixtureSportsActions(fixture.game_id, player.tracking_id)
    const { data, isLoading: loadingSportsActions } = useSWR(key, () => gamesService.getAthleteFixtureSportsActions(fixture.game_id, player.tracking_id));

    const sportActions = useMemo(() => {
        return data ?? [];
    }, [data]);

    const isLoading = loadingPr || loadingSportsActions;

    const hasActions = sportActions.length > 0;

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
    }

    if (isLoading) {
        <BottomSheetView
            className="min-h-[80vh] animate-pulse max-h-[900px] py-2 px-4 flex flex-col items-center justify-center gap-2"
        >
            <LoadingState />
        </BottomSheetView>
    }

    return (
        <Activity mode={isOpen ? "visible" : "hidden"} >
            <BottomSheetView
                className="min-h-[80vh] max-h-[900px] py-2 px-4 flex flex-col gap-2"
            >
                <div className="flex flex-row items-center justify-between " >

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
                                url={player.image_url}
                                teamId={player.team_id}
                                playerImageClassName="w-16 h-16"
                                jerseyClassName="min-w-16 min-h-16"
                                jerseyConClassName="min-w-16 min-h-16"
                            />
                        </div>

                        <div className="flex flex-col gap-0.5" >
                            <p>{player.player_name}</p>
                            <SecondaryText>{player.team?.athstat_name}</SecondaryText>
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-center gap-2" >

                        {pr && <MatchPrCard
                            pr={pr.updated_power_ranking}
                        />}

                        <SecondaryText className="text-wrap text-center text-xs" >Match Rating</SecondaryText>
                    </div>
                </div>

                <Activity mode={hasActions ? "visible" : "hidden"} >
                    <div>
                        <StatCard
                            label="Minutes Played"
                            value={""}
                        />
                    </div>
                </Activity>

                <Activity mode={!hasActions ? "visible" : "hidden"} >
                    <div className="flex flex-col items-center justify-center px-[15%] h-[200px] text-center" >
                        <SecondaryText>Match Statisitics for <strong>{player.player_name}</strong> are not available</SecondaryText>
                    </div>
                </Activity>

            </BottomSheetView>
        </Activity>
    )
}
