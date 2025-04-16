import { useEffect, useState } from 'react';
import { getLeagueChatChannelUrl, getLeagueChatName } from '../../data/messaging/messaging.utils'
import { AsyncError } from '../../services/errors';
import { LeagueFromState } from '../../types/league'
import { connectUserToSendBird, SEND_BIRD_APP_ID } from '../../data/messaging/send_bird.init';
import { authService } from '../../services/authService';
import { createOrGetChannel as createOrGetGroupChannel } from '../../data/messaging/open_channel.send_bird.init';
import SendbirdProvider from '@sendbird/uikit-react/SendbirdProvider';
import GroupChatFeed from '../messaging/GroupChatFeed';

type Props = {
    league: LeagueFromState
}

export default function LeagueGroupChatFeed({league} : Props) {

    const authUser = authService.getUserInfo();
    if (authUser === null) return <></>;

    const channelUrl = getLeagueChatChannelUrl(league);
    const [sbInstance, setSbInstance] = useState<SendBird.SendBirdInstance>();
    const [channel, setChannel] = useState<SendBird.GroupChannel>();
    const [error, setError] = useState<AsyncError>();

    
    useEffect(() => {
        const init = async () => {
            if (!authUser) return;

            const {data: sb, error: sbError} = await connectUserToSendBird(authUser);
            if (!sb) setError(sbError);
            
            if (sb) {
                setSbInstance(sb);
                const channelName = getLeagueChatName(league);
                const {data: channel, error: channelError} = await createOrGetGroupChannel(channelUrl, channelName , sb);

                if (channel) setChannel(channel);
                if (channelError) setError(channelError);
            }
        }

        init();

        return () => {

            if (sbInstance) {
                sbInstance.disconnect();
            }
        }

    }, [channelUrl]);

  return (
    <div className='league-group-chat-container'>
        <div className='text-white bg-slate-800/50 p-5 rounded-xl' >
            <h1 className='text-2xl font-bold' >League Chat Room</h1>
            <h2 className='text-slate-400' >{league.title}</h2>

            {error && <p className='text-red-500' >{error.message}</p>}
            {channel && sbInstance &&
                <SendbirdProvider appId={SEND_BIRD_APP_ID} userId={authUser.id}>
                    <GroupChatFeed sb={sbInstance} channel={channel} />
                </SendbirdProvider>
            }
        </div>
    </div>
  )
}
