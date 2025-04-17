import { OpenChannel, SendBirdProvider } from "@sendbird/uikit-react"
import { SCHOOL_BOY_RUGBY_CHANNEL_NAME, SCHOOL_BOY_RUGBY_CHANNEL_URL } from "../data/messaging/school_boy_ruby"
import { SEND_BIRD_APP_ID } from "../data/messaging/send_bird.init";
import { useEffect } from "react";
import { useOpenChat } from "../hooks/useOpenChat";
import { ErrorState } from "../components/ui/ErrorState";

export default function SchoolBoyRugbyScreen() {
  
  const {authUser, sbInstance} = useOpenChat(SCHOOL_BOY_RUGBY_CHANNEL_URL, SCHOOL_BOY_RUGBY_CHANNEL_NAME)

  useEffect(() => {
    return () => {
      if (sbInstance) sbInstance.disconnect();
    }
  }, []);

  if (!authUser) return <ErrorState message={"You must be logged in to access the School Boy Rugby Chat"} />

  return (
    <div className='text-white h-full' style={{ height: '100vh' }}>
        <SendBirdProvider appId={SEND_BIRD_APP_ID} userId={authUser?.id ?? "0"}>
          <OpenChannel channelUrl={SCHOOL_BOY_RUGBY_CHANNEL_URL} />
        </SendBirdProvider>
    </div>
  )
}
