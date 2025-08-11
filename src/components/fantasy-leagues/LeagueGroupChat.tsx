import { getLeagueChatChannelUrl, getLeagueChannelName } from '../../data/messaging/messaging.utils'

import "@sendbird/uikit-react/dist/index.css";
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import OpenChatFeed from '../messaging/OpenChatFeed';
import { FantasyLeagueGroup } from '../../types/fantasyLeagueGroups';

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


type LeagueGroupChat = {
    league: FantasyLeagueGroup
}

/** Renders a Chat Feed for a fantasy league group */
export function FantasyLeagueGroupChatFeed({ league }: LeagueGroupChat) {

    const channelUrl = `fantasy_league_group_chat_${String(league.id).replace(/-/g, '_')}`;
    const channelName = `${league.title} Chat`;

    return (

        <OpenChatFeed
            channelName={channelName}
            channelUrl={channelUrl}
        />

    )
}
