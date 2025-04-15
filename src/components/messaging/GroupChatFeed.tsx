import GroupChannel from '@sendbird/uikit-react/GroupChannel';

type Props = {
    sb: SendBird.SendBirdInstance;
    channel: SendBird.GroupChannel;
}

export default function GroupChatFeed({ channel }: Props) {

    return (
        <GroupChannel channelUrl={channel.url} >
        </GroupChannel>
    )
}
