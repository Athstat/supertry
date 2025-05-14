import { useEffect } from 'react';
import { getLeagueChatChannelUrl, getLeagueChannelName } from '../../data/messaging/messaging.utils'
import { SEND_BIRD_APP_ID } from '../../data/messaging/send_bird.init';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';

import "@sendbird/uikit-react/dist/index.css";
import { useOpenChat } from '../../hooks/useOpenChat';
import { ErrorState } from '../ui/ErrorState';
import { OpenChannelProvider } from '@sendbird/uikit-react/OpenChannel/context';
import OpenChannelUI from '@sendbird/uikit-react/OpenChannel/components/OpenChannelUI';
import { IFantasyLeague } from '../../types/fantasyLeague';
import DelayedView from '../shared/containers/DelayedView';

type Props = {
    league: IFantasyLeague
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

        <DelayedView className='h-[600px]' >
            <SendbirdProvider
                appId={SEND_BIRD_APP_ID}
                userId={authUser.id}
            >
                <OpenChannelProvider channelUrl={channelUrl}>
                    <OpenChannelUI />
                </OpenChannelProvider>
            </SendbirdProvider>
        </DelayedView>

    )
}
