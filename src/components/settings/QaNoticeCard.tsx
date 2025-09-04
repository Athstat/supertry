import { isInProduction } from "../../utils/webUtils"
import WarningCard from "../shared/WarningCard";
import { twMerge } from "tailwind-merge";
import { FlaskConical } from "lucide-react";

type Props = {

}

export default function QaNoticeCard({ }: Props) {

    const isInProd = isInProduction();

    if (isInProd) return;

    return (
        <WarningCard
            className={twMerge(
                "p-4 flex flex-col gap-2 items-start justify-start",
                "bg-green-400/20 text-green-600 border-green-600/50",
                "dark:bg-green-900/20 dark:text-green-600 dark:border-green-600/50"
            )}
        >
            <div className="flex flex-row items-center gap-1" >
                <FlaskConical className='w-5 h-5' />
                <p className="font-bold" >Beta Mode</p>
            </div>

            <div className="text-sm" >
                <p>Heads up! You are in QA Mode, app might be unstable</p>
            </div>

            <div className="text-sm" >
                <a href="scrummy://?env=prod" className="text-blue-500" >Click here to switch Prod</a>
            </div>
        </WarningCard>
    )
}
