import { Bell } from 'lucide-react'
import PageView from '../PageView'
import RoundedCard from '../../components/shared/RoundedCard'
import useSWR from 'swr'
import { inAppMessagesServices } from '../../services/notifications/inAppMessagesService';
import InAppMessageCard from '../../components/notifications/InAppMessage';
import { useEffect, useMemo } from 'react';
import TabView, { TabViewHeaderItem, TabViewPage } from '../../components/shared/tabs/TabView';
import EmptyUnreadNotificationsMessage, { EmptyReadNotificationsMessage } from '../../components/notifications/EmptyNotificationsMessage';

export default function InAppMessagesScreen() {

    const key = `/in-app-notifications/user-messages`;
    const { data: messages, isLoading, mutate } = useSWR(key, () => inAppMessagesServices.getMessages());

    useEffect(() => {

        /** Refresh notifications list after closing component */
        return () => {
            mutate();
        }
    }, [mutate]);

    const sortedMessages = useMemo(() => {
        const copy = [...(messages ?? [])]
        return copy.sort((a, b) => {
            const aEpoch = new Date(a.created_at).valueOf();
            const bEpoch = new Date(b.created_at).valueOf();

            return bEpoch - aEpoch
        })
    }, [messages]);

    const unreadMessages = useMemo(() => {
        const copy = [...(sortedMessages ?? [])]
        return copy.filter((m) => {
            return m.is_read === false
        })
    }, [sortedMessages]);

    const readMessages = useMemo(() => {
        const copy = [...(sortedMessages ?? [])]
        return copy.filter((m) => {
            return m.is_read === true
        })
    }, [sortedMessages]);

    const unreadCount = unreadMessages.length;
    const readCount = readMessages.length;

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

            {isLoading && <LoadingSkeleton />}

            {!isLoading && <TabView
                tabHeaderItems={tabItems}
            >

                <TabViewPage
                    tabKey='unread'
                >
                    {!isLoading && <div className='flex flex-col w-full gap-4' >
                        {(unreadMessages).map((m) => {
                            return (
                                <InAppMessageCard
                                    message={m}
                                    key={m.id}
                                />
                            )
                        })}
                    </div>}

                    {unreadCount === 0 && (
                        <EmptyUnreadNotificationsMessage />
                    )}

                </TabViewPage>

                <TabViewPage
                    tabKey='read'
                >
                    {!isLoading && <div className='flex flex-col w-full gap-4' >
                        {(readMessages).map((m) => {
                            return (
                                <InAppMessageCard
                                    message={m}
                                    key={m.id}
                                />
                            )
                        })}
                    </div>}

                    {readCount === 0 && (
                        <EmptyReadNotificationsMessage />
                    )}
                </TabViewPage>

            </TabView>}


        </PageView>
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