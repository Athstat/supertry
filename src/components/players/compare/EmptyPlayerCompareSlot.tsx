import { Plus } from "lucide-react";
import { twMerge } from "tailwind-merge";
import SecondaryText from "../../shared/SecondaryText";


export default function EmptyPlayerCompareSlot() {
    return (
        <div className={twMerge(
            "flex flex-col gap-2 m-4 flex-1 min-w-[300px] max-w-[300px]",
            "bg-slate-200 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-600 rounded-xl max-h-screen",
            "flex flex-col items-center justify-center"
        )}>
            <div className="flex flex-col items-center gap-2 justify-center" >

                <SecondaryText>
                    <Plus className="w-14 h-14" />
                </SecondaryText>

                <SecondaryText className="" >
                    Add Player
                </SecondaryText>

            </div>

        </div>
    )
}
