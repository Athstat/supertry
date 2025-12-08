import useSWR from "swr";
import { IProAthlete } from "../../../types/athletes"
import { scoutingService } from "../../../services/fantasy/scoutingService";
import { useScoutingList } from "../../../hooks/fantasy/scouting/useScoutingList";
import RoundedCard from "../../shared/RoundedCard";
import { Binoculars } from "lucide-react";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { Activity, Fragment, useMemo } from "react";
import { ScoutingListPlayer } from "../../../types/fantasy/scouting";
import { Toast } from "../../ui/Toast";

type Props = {
    player: IProAthlete
}

/** Renders Button to scout player */
export default function ScoutPlayerButton({ player }: Props) {

    // We need to know if player is currently being scouted!
    const key = `/fantasy/scouting/my-list/${player.tracking_id}`;
    const { data: scoutingListPlayer, isLoading, mutate } = useSWR(key, () => scoutingService.getScoutingListPlayer(player.tracking_id));

    const isOnScoutingList = useMemo(() => {
        return scoutingListPlayer === undefined && !isLoading;
    }, [isLoading, scoutingListPlayer]);

    const { addPlayer, isAdding, error, message, clearError, clearMessage } = useScoutingList();

    const handleSuccess = async (res: ScoutingListPlayer) => {
        await mutate(res);
    }

    const handleClick = () => {
        if (isOnScoutingList) {
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
                        <p className="text-sm" >Scout Player</p>
                    </div>
                </PrimaryButton>
            </Activity>

            <Activity mode={isOnScoutingList ? "visible" : "hidden"} >
                <RoundedCard
                    className="flex w-[130px] h-[33px] flex-row items-center justify-center py-1.5 px-2"
                    onClick={handleClick}
                >
                    <div className="flex flex-row items-center gap-2" >
                        <Binoculars className="w-4 h-4" />
                        <p className="text-sm" >Currently Scouting</p>
                    </div>

                </RoundedCard>
            </Activity>

            {error && <Toast
                isVisible={Boolean(error)}
                message={error}
                type="error"
                onClose={clearError}
            />}

            {message && <Toast
                isVisible={Boolean(message)}
                message={message}
                type="success"
                onClose={clearMessage}
            />}

        </Fragment>
    )
}
