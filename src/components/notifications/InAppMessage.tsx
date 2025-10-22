import { useNavigate } from "react-router-dom"
import { InAppMessage } from "../../types/notifications/inAppMessage"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import { inAppMessagesServices } from "../../services/notifications/inAppMessagesService"
import { logger } from "../../services/logger"
import { twMerge } from "tailwind-merge"

type Props = {
    message: InAppMessage
}

/** Renders an in app message card with modern card design */
export default function InAppMessageCard({ message }: Props) {
    
    const navigate = useNavigate();
    const {inView, ref} = useInView({triggerOnce: true});
    const [isRead, setIsRead] = useState(message.is_read);

    useEffect(() => {
        const mark_as_read = async () => {

            if (!inView) {
                return;
            }

            try {
                await inAppMessagesServices.markAsRead(message.id);
                setIsRead(true);   
            } catch (err) {
                logger.error("Error marking message as read ", err);
            }
        }

        /** Marks notification as unread after ten seconds */
        const timeout = setTimeout(() => {
            
            if (inView) {
                mark_as_read();
            }

        }, 10000);

        return () => {
            clearTimeout(timeout);
        }
    }, [inView, message]);

    const handleCtaAction = () => {
        if (message.cta_in_app_link) {
            navigate(message.cta_in_app_link);
        }
    }

    ;
    const timeSince = useMemo(() => {
        const createdAt = new Date(message.created_at ?? new Date())
        const copy = formatDistanceToNow(createdAt, { addSuffix: true });

        return copy.replace('about', '');
    }, [message]);

    return (
        <div 
            className="p-4 w-full bg-white border border-slate-200 dark:border-transparent dark:bg-slate-800/40 rounded-2xl"
            onClick={handleCtaAction}
            ref={ref}
        >
            
            <div className="flex gap-2">
                {/* Icon */}
                <div className="flex-shrink-0 pt-1">
                    <div className={twMerge(
                        "w-2.5 h-2.5 rounded-full bg-primary-500 flex items-center justify-center",
                        isRead && "bg-transparent"
                    )}>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Title and Time */}
                    <div className="flex items-start justify-between gap-3 mb-0">
                        <h3 className="font-semibold truncate text-sm dark:text-white leading-tight">
                            {message.title}
                        </h3>
                        {message.created_at && (
                            <span className="text-xs dark:text-slate-400 text-slate-500 flex-shrink-0">
                                {timeSince}
                            </span>
                        )}
                    </div>

                    {/* Subtitle */}
                    {message.sub_title && (
                        <p className="text-sm dark:text-slate-300 text-slate-500 leading-relaxed mb-1">
                            {message.sub_title}
                        </p>
                    )}

                    {/* Message */}
                    {message.message && (
                        <p className="text-sm dark:text-slate-400 text-slate-600 leading-relaxed">
                            {message.message}
                        </p>
                    )}

                    {/* CTA Button */}
                    {message.cta_text && (
                        <button
                            onClick={handleCtaAction}
                            className="mt-3 text-sm text-primary-500 hover:text-blue-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                        >
                            {message.cta_text}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
