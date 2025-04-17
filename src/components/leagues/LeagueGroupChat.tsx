import { useEffect } from 'react';
import { getLeagueChatChannelUrl, getLeagueChannelName } from '../../data/messaging/messaging.utils'
import { LeagueFromState } from '../../types/league'
import { SEND_BIRD_APP_ID } from '../../data/messaging/send_bird.init';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import GroupChannel from '@sendbird/uikit-react/GroupChannel';

import "@sendbird/uikit-react/dist/index.css";
import { useOpenChat } from '../../hooks/useOpenChat';
import { ErrorState } from '../ui/ErrorState';
import { OpenChannel } from '@sendbird/uikit-react';

type Props = {
    league: LeagueFromState
}

export default function LeagueGroupChatFeed({ league }: Props) {

    const channelUrl = getLeagueChatChannelUrl(league);
    const channelName = getLeagueChannelName(league);
    
    const { authUser, sbInstance } = useOpenChat(channelUrl, channelName)

    useEffect(() => {
        return () => {
            if (sbInstance) sbInstance.disconnect();
        }
    }, []);

    if (!authUser) return <ErrorState message={"You must be logged in to access the School Boy Rugby Chat"} />


    return (
        <div className='' >
            <h1 className='text-2xl mt-10 font-bold' >League Chat Room</h1>

            <div className='h-[600px]' >
                <SendbirdProvider appId={SEND_BIRD_APP_ID} userId={authUser.id}>
                    <OpenChannel channelUrl={channelUrl} />
                </SendbirdProvider>
            </div>
        </div>

    )
}
