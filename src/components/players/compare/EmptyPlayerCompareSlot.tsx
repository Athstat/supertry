import { Plus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import SecondaryText from "../../shared/SecondaryText";
import QuickPlayerSelectModal from "../QuickPlayerPickModal";
import { useState } from "react";
import { useAtom } from "jotai";
import { comparePlayersAtom } from "../../../state/comparePlayers.atoms";
import { IProAthlete } from "../../../types/athletes";


export default function EmptyPlayerCompareSlot() {

    const [comparePlayers, setComparePlayers] = useAtom(comparePlayersAtom);
    const [show, setShow] = useState(false);

    const toggle = () => setShow(!show);

    const onSelectPlayers = (arr: IProAthlete[]) => {
        setComparePlayers(arr);
    }

    return (
        <div
            className={twMerge(
                "flex flex-col gap-2 m-4 flex-1 min-w-[300px] max-w-[300px]",
                "bg-slate-200 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-600 rounded-xl min-h-screen max-h-screen",
                "flex flex-col items-center justify-center"
            )}

        >
            <div onClick={toggle} className="flex cursor-pointer flex-1 flex-col items-center gap-2 justify-center" >

                <SecondaryText>
                    <Plus className="w-14 h-14" />
                </SecondaryText>

                <SecondaryText className="" >
                    Add Player
                </SecondaryText>

            </div>

            <QuickPlayerSelectModal
                open={show}
                exclude={comparePlayers}
                onClose={toggle}
                onSelectPlayers={onSelectPlayers}
            />
        </div>
    )
}
