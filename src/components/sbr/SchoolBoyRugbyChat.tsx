import { twMerge } from 'tailwind-merge'
import OpenChatFeed from '../messaging/OpenChatFeed'
import { SCHOOL_BOY_RUGBY_CHANNEL_NAME, SCHOOL_BOY_RUGBY_CHANNEL_URL } from '../../data/messaging/school_boy_ruby'

type Props = {
    className?: string
}

/** Renders school boy rugby chat */
export default function SchoolBoyRugbyChat({ className }: Props) {

    return (
        <OpenChatFeed 
            className={twMerge(
                "text-white h-[80vh] overflow-hidden",
                className
            )}
            channelUrl={SCHOOL_BOY_RUGBY_CHANNEL_URL}
            channelName={SCHOOL_BOY_RUGBY_CHANNEL_NAME}
        />
    )
}
