import { Bell } from 'lucide-react'
import PageView from '../PageView'
import RoundedCard from '../../components/shared/RoundedCard'
import useSWR from 'swr'
import { inAppMessagesServices } from '../../services/notifications/inAppMessagesService';
import InAppMessageCard from '../../components/notifications/InAppMessage';
import { useMemo } from 'react';

export default function InAppMessagesScreen() {

    const key = `/in-app-notifications/user-messages`;
    const {data: messages, isLoading} = useSWR(key, () => inAppMessagesServices.getMessages());

    const sortedMessages = useMemo(( ) => {
        const copy = [...(messages ?? [])]
        return copy.sort((a, b) => {
            const aEpoch = new Date(a.created_at).valueOf();
            const bEpoch = new Date(b.created_at).valueOf();

            return bEpoch - aEpoch
        })
    }, [messages]);

    return (
        <PageView className='px-4 flex flex-col gap-4' >
            <div
                className='flex flex-row items-center gap-2'
            >
                <Bell />
                <p className='font-bold text-xl' >Notifications</p>
            </div>

            { isLoading && <LoadingSkeleton />}

            <div className='flex flex-col gap-4' >
                {(sortedMessages).map((m) => {
                    return (
                        <InAppMessageCard 
                            message={m}
                        />
                    )
                })}
            </div>
        </PageView>
    )
}


function LoadingSkeleton() {
    return (
        <div>
            <RoundedCard />
        </div>
    )
}