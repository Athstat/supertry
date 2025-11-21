import { Plus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import SecondaryText from "../../shared/SecondaryText";
import QuickPlayerSelectModal from "../QuickPlayerPickModal";
import { Activity, useCallback, useState } from "react";
import { IProAthlete } from "../../../types/athletes";
import { usePlayerCompareActions } from "../../../hooks/usePlayerCompare";
import { useAtomValue } from "jotai";
import { comparePlayersAtomGroup } from "../../../state/comparePlayers.atoms";


export default function EmptyPlayerCompareSlot() {

    const [show, setShow] = useState(false);

    const alreadySelectedPlayers = useAtomValue(
        comparePlayersAtomGroup.comparePlayersAtom
    );

    const { addMultiplePlayers, isCompareLimitReached } = usePlayerCompareActions();

    const toggle = () => setShow(!show);

    const onSelectPlayers = (arr: IProAthlete[]) => {
        addMultiplePlayers(arr);
    }

    const handleOnClick = useCallback(() => {
        if (isCompareLimitReached) {
            return;
        }

        toggle();
    }, [isCompareLimitReached, toggle]);


    return (
        <div
            className={twMerge(
                "flex flex-col gap-2 m-4 flex-1 min-w-[300px] max-w-[300px]",
                "bg-slate-200 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-600 rounded-xl min-h-screen max-h-screen",
                "flex flex-col items-center justify-center",
                isCompareLimitReached && "hidden"
            )}

        >
            <div onClick={handleOnClick} className="flex cursor-pointer hover:bg-slate-300 hover:dark:bg-slate-800  w-full flex-1 flex-col items-center gap-2 justify-center" >

                <Activity mode={isCompareLimitReached ? "hidden" : "visible"} >
                    <SecondaryText>
                        <Plus className="w-14 h-14" />
                    </SecondaryText>

                    <SecondaryText className="" >
                        Add Player
                    </SecondaryText>
                </Activity>

                <Activity mode={isCompareLimitReached ? "visible" : "hidden"} >
                    <SecondaryText>
                        Compare Limit Reached
                    </SecondaryText>

                    <SecondaryText className="" >
                        You can only compare up to 5 players
                    </SecondaryText>
                </Activity>

            </div>

            <QuickPlayerSelectModal
                open={show}
                exclude={alreadySelectedPlayers}
                onClose={toggle}
                onSelectPlayers={onSelectPlayers}
            />
        </div>
    )
}
