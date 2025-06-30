import { SendBirdProvider } from "@sendbird/uikit-react";
import { SEND_BIRD_APP_ID } from "../data/messaging/send_bird.init";
import { authService } from "../services/authService";
import { useTheme } from "./ThemeContext";
import { ReactNode } from "react";

type Props = {
    children?: ReactNode
}

/* Provides chat fucntionality to children */
export default function ChatProvider({ children }: Props) {

    const user = authService.getUserInfo();
    const { theme } = useTheme()

    return (
        <SendBirdProvider
            appId={SEND_BIRD_APP_ID}
            userId={user?.id ?? "Fallback User Id"}
            theme={theme}
        >

            {children}

        </SendBirdProvider>
    )
}
