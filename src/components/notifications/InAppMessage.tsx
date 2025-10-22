import { useNavigate } from "react-router-dom"
import { InAppMessage } from "../../types/notifications/inAppMessage"
import SecondaryText from "../shared/SecondaryText"
import { formatDistanceToNow } from "date-fns"
import { twMerge } from "tailwind-merge"

type Props = {
    message: InAppMessage
}

/** Renders an in app message card */
export default function InAppMessageCard({ message }: Props) {

    const navigate = useNavigate();

    const handleCtaAction = () => {
        if (message.cta_in_app_link) {
            navigate(message.cta_in_app_link);
        }
    }

    const createdAt = new Date(message.created_at ?? new Date());
    const timeSince = formatDistanceToNow(createdAt, { addSuffix: true })

    return (
        <div
            className={twMerge(
                "p-4 flex flex-row overflow-hidden border gap-2  dark:border-slate-800/60 dark:bg-slate-800/40 rounded-xl"
            )}
        >
            <div className="h-full flex pt-2 flex-col items-center justify-start" >
                <div>
                    {/* <BellDot className="w-4 h-4" /> */}
                    <div className="bg-primary-500 rounded-full w-2.5 h-2.5" ></div>
                </div>
            </div>

            <div className="flex flex-col overflow-hidden  gap-2 w-full" >

                <div className="flex flex-row overflow-hidden items-start w-full flex-1 justify-between" >
                    <div className="flex flex-col truncate" >
                        <p className="text-sm truncate " >{message.title}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300" >{message.sub_title}</p>
                    </div>

                    {message.created_at && <div className="text-nowrap" >
                        <SecondaryText className="text-xs" >{timeSince}</SecondaryText>
                    </div>}
                </div>

                {message.message && (
                    <div>
                        <p className="text-xs text-slate-600 dark:text-slate-400" >{message.message}</p>
                    </div>
                )}

                {message.cta_text && (
                    <div>
                        <button
                            className="text-primary-500 text-sm hover:text-blue-500"
                            onClick={handleCtaAction}
                        >
                            {message.cta_text}
                        </button>
                    </div>
                )}
            </div>



        </div>
    )
}
