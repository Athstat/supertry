import { IProAthlete } from "../../../types/athletes"
import { useScoutingList } from "../../../hooks/fantasy/scouting/useScoutingList";
import { Binoculars } from "lucide-react";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { Activity, Fragment } from "react";
import { Toast } from "../../ui/Toast";
import { usePlayerData } from "../../../providers/PlayerDataProvider";
import RoundedCard from "../../ui/cards/RoundedCard";
import { ScoutingListPlayer } from "../../../types/fantasy/scouting";

type Props = {
    player: IProAthlete
}

/** Renders Button to scout player */
export default function ScoutPlayerButton({ player }: Props) {

    const {setShowScoutingActionModal} = usePlayerData();

    const { 
        addPlayer, isAdding, error,
        clearError, mutateList, loadingList: isLoading,
        checkPlayerIsOnList, list
    } = useScoutingList();

    const isOnScoutingList = checkPlayerIsOnList(player.tracking_id)

    const handleSuccess = async (res: ScoutingListPlayer) => {
        await mutateList([...list, res]);
    }

    const handleClick = () => {
        if (isOnScoutingList) {
            setShowScoutingActionModal(true);
            return;
        }

        addPlayer(player.tracking_id, handleSuccess)
    }


    if (isLoading) {
        return (
            <RoundedCard className="flex animate-pulse border-none w-[130px] h-[33px] flex-row items-center justify-center py-1.5 px-2" >
            </RoundedCard>
        )
    }

    return (

        <Fragment>

            <Activity mode={!isOnScoutingList ? "visible" : "hidden"} >
                <PrimaryButton
                    className="flex w-fit h-[33px] flex-row items-center justify-center py-1.5 px-2"
                    onClick={handleClick}
                    isLoading={isAdding || isLoading}
                    disabled={isAdding || isLoading}
                >
                    <div className="flex flex-row items-center gap-2" >
                        <Binoculars className="w-4 h-4" />
                        <p className="text-xs" >Scout Player</p>
                    </div>
                </PrimaryButton>
            </Activity>

            <Activity mode={isOnScoutingList ? "visible" : "hidden"} >
                <RoundedCard
                    className="flex w-fit h-[33px] cursor-pointer rounded-xl dark:border-none dark:bg-slate-700/70 dark:hover:bg-slate-700 flex-row items-center justify-center py-1.5 px-2"
                    onClick={handleClick}
                >
                    <div className="flex flex-row items-center gap-2" >
                        <Binoculars className="w-4 h-4" />
                        <p className="text-xs" >Currently Scouting</p>
                    </div>

                </RoundedCard>
            </Activity>

            

            {error && <Toast
                isVisible={Boolean(error)}
                message={error}
                type="error"
                onClose={clearError}
            />}

        </Fragment>
    )
}
