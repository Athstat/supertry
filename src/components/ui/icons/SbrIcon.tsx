import { useTheme } from "../../../contexts/app_state/ThemeContext"

type Props = {
    lightFill?: string,
    darkFill?: string
}

export default function SbrIcon({lightFill = "black", darkFill = "white"} : Props) {

    const {theme} = useTheme();
    const fill = theme === "dark" ? darkFill : lightFill;

    return (
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.5 26.25V22.5C17.5 21.837 17.2366 21.2011 16.7678 20.7322C16.2989 20.2634 15.663 20 15 20C14.337 20 13.7011 20.2634 13.2322 20.7322C12.7634 21.2011 12.5 21.837 12.5 22.5V26.25M22.5 6.25V26.25M5 7.5L13.8825 2.7625C14.2295 2.5891 14.6121 2.49883 15 2.49883C15.3879 2.49883 15.7705 2.5891 16.1175 2.7625L25 7.5" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.5 13.75L3.1 16.4338C2.91682 16.5453 2.7654 16.702 2.66033 16.889C2.55525 17.0759 2.50004 17.2868 2.5 17.5013V23.75C2.5 24.413 2.76339 25.0489 3.23223 25.5178C3.70107 25.9866 4.33696 26.25 5 26.25H25C25.663 26.25 26.2989 25.9866 26.7678 25.5178C27.2366 25.0489 27.5 24.413 27.5 23.75V17.5C27.4998 17.2858 27.4444 17.0752 27.3394 16.8885C27.2343 16.7017 27.083 16.5452 26.9 16.4338L22.5 13.75M7.5 6.25V26.25" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 13.75C16.3807 13.75 17.5 12.6307 17.5 11.25C17.5 9.86929 16.3807 8.75 15 8.75C13.6193 8.75 12.5 9.86929 12.5 11.25C12.5 12.6307 13.6193 13.75 15 13.75Z" stroke={fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}
