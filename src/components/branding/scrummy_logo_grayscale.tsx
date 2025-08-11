import { useTheme } from "../../contexts/ThemeContext";
import lightModeLogo from "./assets/logo_graysale_dark_mode.svg";
import darkModeLogo from "./assets/logo_graysale_dark_mode.png";
import { twMerge } from "tailwind-merge";

type LogoProps = {
    className?: string
}

const defaultLogoClass = "w-20 h-20 md:w-24 md:h-24";

export function ScrummyLogoGrayScale({className = defaultLogoClass} : LogoProps) {

    const {theme} = useTheme();

    if (theme === "dark" ) {
        return <ScrummyDarkModeLogo className={className} />
    }

    return <ScrummyLightModeLogo className={className} />

}


export function ScrummyLightModeLogo({ className }: LogoProps) {
    return (
        <>
            <img className={twMerge(defaultLogoClass, className)} src={lightModeLogo} alt='scrummy_logo' />
        </>
    )
}

export function ScrummyDarkModeLogo({ className }: LogoProps) {
    return (
        <>
            <img className={twMerge(defaultLogoClass, className)} src={darkModeLogo} alt='scrummy_logo' />
        </>
    )
}