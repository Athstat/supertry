import { useTheme } from '../../contexts/ThemeContext'
import lightModeLogo from "./assets/logo_long_light_mode.svg";
import darkModeLogo from "./assets/logo_long_dark_mode.svg";
import { twMerge } from 'tailwind-merge';

type LogoProps = {
    className?:string
}

const defaultLogoClass = "w-44 md:w-48 h-fit";

export default function ScrummyLogoHorizontal({className} : LogoProps) {
    const { theme } = useTheme();

    return (
        <>
            {theme === 'light' ? 
                <ScrummyLightModeLogoHorizontal className={className}  /> 
                : <ScrummyDarkModeLogoHorizontal className={className} />
            }
        </>
    )
}

export function ScrummyLightModeLogoHorizontal({className} : LogoProps) {
    return (
        <>
            <img className={twMerge(defaultLogoClass, className)} src={lightModeLogo} alt='scrummy_logo' />
        </>
    )
}

export function ScrummyDarkModeLogoHorizontal({className} : LogoProps) {
    return (
        <>
            <img className={twMerge(defaultLogoClass, className)} src={darkModeLogo} alt='scrummy_logo' />
        </>
    )
}