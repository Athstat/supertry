import { getLeagueChatChannelUrl, getLeagueChannelName } from '../../data/messaging/messaging.utils'

import "@sendbird/uikit-react/dist/index.css";
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import OpenChatFeed from '../messaging/OpenChatFeed';

type Props = {
    league: IFantasyLeagueRound
}

export default function LeagueGroupChatFeed({ league }: Props) {

    const channelUrl = getLeagueChatChannelUrl(league);
    const channelName = getLeagueChannelName(league);

    return (

        <OpenChatFeed 
            channelName={channelName}
            channelUrl={channelUrl}
        />

    )
}
