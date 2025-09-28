import { X } from "lucide-react"
import { IFixture } from "../../../types/games"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
import TeamLogo from "../../team/TeamLogo"
import useSWR from "swr"
import { boxScoreService } from "../../../services/boxScoreService"
import Conditionally from "../../debug/Conditionally"
import { LoadingState } from "../../ui/LoadingState"
import SecondaryText from "../../shared/SecondaryText"

type Props = {
    game: IFixture,
    className?: string
    onClose?: () => void,
    open?: boolean,
}

export default function GameStoryBoard({ game, className, onClose }: Props) {

    const [slideNumber, setSlideNumber] = useState<number>(1);

    const fixtureId = game.game_id;

    const sportsActionsKey = fixtureId ? `fixtures/${fixtureId}/sports-actions` : null;
    const { data: sportActions, isLoading: loadingSportsActions } = useSWR(sportsActionsKey, () =>
        boxScoreService.getSportActionsByGameId(fixtureId ?? '')
    );

    const rostersKey = fixtureId ? `fixtures/${fixtureId}/rosters` : null;
    const { data: fetchedRosters, isLoading: loadingRosters } = useSWR(rostersKey, () => gamesService.getGameRostersById(fixtureId ?? ""));


    const isLoading = loadingSportsActions || loadingRosters;


    const slides = [
        {
            title: "",
        },
    ];




    return (

        <div className="w-full flex  flex-col items-center justify-center bg-black top-0 left-0 fixed h-full  z-[60] bg-opacity-65" >
            <div
                className={twMerge(
                    'bg-white w-[95%] rounded-xl h-[95vh] relative',
                    className
                )}
            >
                <div className="w-full h-full" >

                    <div className="flex  rounded-xl p-4 flex-row items-center justify-between" >
                        <div>
                            {game.team?.athstat_name} vs {game.opposition_team?.athstat_name}
                        </div>

                        <div>
                            <button onClick={onClose} className="" >
                                <X />
                            </button>
                        </div>
                    </div>


                    <Conditionally condition={isLoading} >
                        <LoadingState />
                    </Conditionally>

                    <Conditionally condition={!isLoading} >
                        <div>
                            {slideNumber === 1 && (
                                <div className="flex flex-col items-center justify-center" >

                                    <div className="flex flex-row items-center gap-6 justify-between" >
                                        <div className="flex flex-col gap-2 items-center justify-center" >
                                            <TeamLogo
                                                url={game.team?.image_url}
                                            />
                                            <p>{game.team?.athstat_name}</p>
                                        </div>

                                        <div>
                                            <SecondaryText>vs</SecondaryText>
                                        </div>

                                        <div className="flex flex-col gap-2 items-center justify-center" >
                                            <TeamLogo
                                                url={game.opposition_team?.image_url}
                                            />
                                            <p>{game.opposition_team?.athstat_name}</p>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>

                    </Conditionally>

                </div>


            </div>
        </div>
    )
}
