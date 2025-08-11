import OpenChannelUI from "@sendbird/uikit-react/OpenChannel/components/OpenChannelUI"
import { OpenChannelProvider } from "@sendbird/uikit-react/OpenChannel/context"
import { useOpenChat } from "../../hooks/useOpenChat"
import DelayedView from "../shared/containers/DelayedView"
import { twMerge } from "tailwind-merge"
import { useAuth } from "../../contexts/AuthContext"

type Props = {
    channelUrl: string,
    channelName: string,
    className?: string
}

/** Renders an open chat feed box */
export default function OpenChatFeed({ className, channelName, channelUrl }: Props) {

    const {authUser: user} = useAuth();
    useOpenChat(channelUrl, channelName, user);

    return (
        <DelayedView className={twMerge(
            'h-[600px]',
            className
        )} >
            <OpenChannelProvider channelUrl={channelUrl} >
                <OpenChannelUI />
            </OpenChannelProvider>

        </DelayedView>
    )
}
