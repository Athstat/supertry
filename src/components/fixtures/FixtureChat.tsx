import { IFixture } from "../../types/games"
import { getFixtureChannelName, getFixtureChannelUrl } from "../../data/messaging/messaging.utils"
import OpenChatFeed from "../messaging/OpenChatFeed"

type Props = {
    fixture: IFixture
}

/** Renders a fixture chat */
export default function FixtureChat({ fixture }: Props) {

    const channelUrl = getFixtureChannelUrl(fixture);
    const channelName = getFixtureChannelName(fixture);

    return (
        <OpenChatFeed 
            channelName={channelName}
            channelUrl={channelUrl}
        />
    )
}
