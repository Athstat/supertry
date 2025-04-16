import GroupChannel from '@sendbird/uikit-react/GroupChannel';
import "@sendbird/uikit-react/dist/index.css";

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
