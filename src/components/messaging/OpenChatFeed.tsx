import OpenChannelUI from "@sendbird/uikit-react/OpenChannel/components/OpenChannelUI"
import { OpenChannelProvider } from "@sendbird/uikit-react/OpenChannel/context"
import { useOpenChat } from "../../hooks/useOpenChat"
import DelayedView from "../shared/containers/DelayedView"
import { ErrorState } from "../ui/ErrorState"
import { authService } from "../../services/authService"
import { twMerge } from "tailwind-merge"

type Props = {
    channelUrl: string,
    channelName: string,
    className?: string
}

/** Renders an open chat feed box */
export default function OpenChatFeed({ className, channelName, channelUrl }: Props) {

    const user = authService.getUserInfo();
    const { error } = useOpenChat(channelUrl, channelName, user ?? undefined)


    if (error) {
        return <ErrorState error={error} />
    }

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
