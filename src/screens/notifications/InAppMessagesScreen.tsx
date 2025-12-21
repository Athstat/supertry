import { Bell } from 'lucide-react'
import PageView from '../PageView'
import RoundedCard from '../../components/shared/RoundedCard'
import InAppMessageCard from '../../components/notifications/InAppMessage';
import { Activity, useEffect } from 'react';
import TabView, { TabViewHeaderItem, TabViewPage } from '../../components/shared/tabs/TabView';
import { EmptyReadNotificationsMessage } from '../../components/notifications/EmptyNotificationsMessage';
import { useInAppMessageList } from '../../hooks/notifications/useInAppMessageList';
import { InAppMessage } from '../../types/notifications/inAppMessage';

export default function InAppMessagesScreen() {

    const { readCount, readMessages, isLoading, refresh, unreadCount, unreadMessages } = useInAppMessageList();

    useEffect(() => {
        return () => {
            refresh();
        }
    }, [refresh]);

    const tabItems: TabViewHeaderItem[] = [
        {
            label: `Unread ${unreadCount > 0 ? `(${unreadCount})` : ""}`,
            tabKey: 'unread',
            className: 'flex-1'
        },

        {
            label: `Read ${readCount > 0 ? `(${readCount})` : ""}`,
            tabKey: 'read',
            className: "flex-1"
        }
    ]

    return (
        <PageView className='px-4 flex flex-col gap-4' >

            <div
                className='flex flex-row items-center gap-2'
            >
                <Bell />
                <p className='font-bold text-xl' >Notifications</p>
            </div>

            <Activity mode={isLoading ? "visible" : "hidden"} >
                <LoadingSkeleton />
            </Activity>

            <Activity mode={isLoading ? "hidden" : "visible"} >
                <TabView
                    tabHeaderItems={tabItems}
                >

                    <TabViewPage tabKey='unread' >
                        <MessageList messages={unreadMessages} />
                    </TabViewPage>

                    <TabViewPage tabKey='read' >
                        <MessageList messages={readMessages} />
                    </TabViewPage>

                </TabView>
            </Activity>


        </PageView>
    )
}

type MessageListProps = {
    messages: InAppMessage[]
}

function MessageList({ messages }: MessageListProps) {

    const isListEmpty = messages.length === 0;

    if (isListEmpty) {
        return (
            <div className='flex flex-col h-[200px] items-center justify-center' >
                <EmptyReadNotificationsMessage />
            </div>
        )
    }

    return (
        <div className='flex flex-col w-full gap-4' >
            {(messages).map((m) => {
                return (
                    <InAppMessageCard
                        message={m}
                        key={m.id}
                    />
                )
            })}
        </div>
    )
}



function LoadingSkeleton() {
    return (
        <div className='flex flex-col gap-4' >
            <RoundedCard className='h-[80px] animate-pulse p-4 w-full bg-white border border-slate-200 dark:border-transparent dark:bg-slate-800/40 rounded-2xl' />
            <RoundedCard className='h-[80px] animate-pulse p-4 w-full bg-white border border-slate-200 dark:border-transparent dark:bg-slate-800/40 rounded-2xl' />
            <RoundedCard className='h-[140px] animate-pulse p-4 w-full bg-white border border-slate-200 dark:border-transparent dark:bg-slate-800/40 rounded-2xl' />
            <RoundedCard className='h-[80px] animate-pulse p-4 w-full bg-white border border-slate-200 dark:border-transparent dark:bg-slate-800/40 rounded-2xl' />
            <RoundedCard className='h-[80px] animate-pulse p-4 w-full bg-white border border-slate-200 dark:border-transparent dark:bg-slate-800/40 rounded-2xl' />
            <RoundedCard className='h-[80px] animate-pulse p-4 w-full bg-white border border-slate-200 dark:border-transparent dark:bg-slate-800/40 rounded-2xl' />
        </div>
    )
}