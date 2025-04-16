import { useEffect, useState } from 'react';
import { getLeagueChatChannelUrl, getLeagueChatName } from '../../data/messaging/messaging.utils'
import { AsyncError } from '../../services/errors';
import { LeagueFromState } from '../../types/league'
import { connectUserToSendBird, SEND_BIRD_APP_ID } from '../../data/messaging/send_bird.init';
import { authService } from '../../services/authService';
import { createOrGetGroupChannel as createOrGetGroupChannel } from '../../data/messaging/group_channel.send_bird.init';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import GroupChannel from '@sendbird/uikit-react/GroupChannel';

import "@sendbird/uikit-react/dist/index.css";
import { useGroupChat } from '../../hooks/useGroupChat';
import { SCHOOL_BOY_RUGBY_CHANNEL_NAME as channelName, SCHOOL_BOY_RUGBY_CHANNEL_URL as channelUrl } from '../../data/messaging/school_boy_ruby';

type Props = {
    league: LeagueFromState
}

export default function LeagueGroupChatFeed({ league }: Props) {

    const {error, channel, sbInstance, authUser} = useGroupChat(getLeagueChatChannelUrl(league), getLeagueChatName(league));
    const channelReady = channel && sbInstance && authUser;

    useEffect(() => {
        return () => {
            if (sbInstance) sbInstance.disconnect();
        }
    }, []);

    return (
        <div className='' >
            <h1 className='text-2xl mt-10 font-bold' >League Chat Room</h1>
            <h2 className='text-slate-400' >{league.title}</h2>

            {error && <p className='text-red-500' >{error.message}</p>}

            {channelReady &&
                <div className='h-[600px]' >
                    <SendbirdProvider appId={SEND_BIRD_APP_ID} userId={authUser.id}>
                        <GroupChannel channelUrl={channel.url} >
                        </GroupChannel>
                    </SendbirdProvider>
                </div>
            }
        </div>

    )
}
