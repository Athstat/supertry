import { getSbrFixtureChannelName, getSbrFixtureChannelUrl } from "../../../data/messaging/school_boy_ruby";
import { ISbrFixture } from "../../../types/sbr"
import OpenChatFeed from "../../messaging/OpenChatFeed";

type Props = {
    fixture: ISbrFixture
}

export default function SbrFixtureChat({ fixture }: Props) {

    const channelUrl = getSbrFixtureChannelUrl(fixture);
    const channelName = getSbrFixtureChannelName(fixture);

    console.log("Channel URL ", channelUrl);

    return (
        <OpenChatFeed 
            channelName={channelName}
            channelUrl={channelUrl}
        />
    )
}
