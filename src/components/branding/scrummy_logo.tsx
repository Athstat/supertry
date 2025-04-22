import { useTheme } from '../../contexts/ThemeContext'
import lightModeLogo from "./logo_light_mode.svg";
import darkModeLogo from "./logo_dark_mode.svg";
import { twMerge } from 'tailwind-merge';

type LogoProps = {
    className?:string
}

const defaultLogoClass = "w-20 h-20 md:w-24 md:h-24";

export default function ScrummyLogo({className} : LogoProps) {
    const { theme } = useTheme();

    return (
        <>
            {theme === 'light' ? <ScrummyLightModeLogo className={className}  /> : <ScrummyDarkModeLogo className={className} />}
        </>
    )
}

export function ScrummyLightModeLogo({className} : LogoProps) {
    return (
        <>
            <img className={twMerge(defaultLogoClass, className)} src={lightModeLogo} alt='scrummy_logo' />
        </>
    )
}

export function ScrummyDarkModeLogo({className} : LogoProps) {
    return (
        <>
            <img className={twMerge(defaultLogoClass, className)} src={darkModeLogo} alt='scrummy_logo' />
        </>
    )
}