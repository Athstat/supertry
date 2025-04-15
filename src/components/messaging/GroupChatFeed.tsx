import GroupChannel from '@sendbird/uikit-react/GroupChannel';
import GroupChannelUI from '@sendbird/uikit-react/GroupChannel/components/GroupChannelUI';

type Props = {
    sb: SendBird.SendBirdInstance;
    channel: SendBird.GroupChannel;
}

export default function GroupChatFeed({ channel }: Props) {

    return (
        <GroupChannel channelUrl={channel.url} >
            <GroupChannelUI />
        </GroupChannel>
    )
}
