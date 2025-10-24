import { Inbox } from "lucide-react";
import { useTabView } from "../shared/tabs/TabView";

/** Eenders Empty Notification message */
export default function EmptyUnreadNotificationsMessage() {

    const {navigate} = useTabView();

    const handleGoToRead = () => {
        navigate('read');
    }

    return (
        <div className="dark:text-slate-500 text-center gap-6 p-6 text-slate-800 flex flex-col flex-1 items-center justify-center" >
            <Inbox className="w-20 h-20" />
            
            <div className="lg:w-2/3" >
                <p>You are all caught up. You have no unread notifications</p>
                <button onClick={handleGoToRead} className="text-blue-500 underline" >
                    View read notifications
                </button>
            </div>
            
        </div>
    )
}

/** Eenders Empty Notification message */
export function EmptyReadNotificationsMessage() {

    return (
        <div className="dark:text-slate-500 text-center text-slate-800 flex flex-col flex-1 items-center justify-center" >
            <Inbox className="w-20 h-20" />
            <div>
                <p>You are all caught up. You have no notifications</p>
            </div>
        </div>
    )
}
