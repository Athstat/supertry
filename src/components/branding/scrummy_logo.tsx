import { useTheme } from '../../contexts/ThemeContext'
import lightModeLogo from "./logo_light_mode.svg";
import darkModeLogo from "./logo_dark_mode.svg";
import { twMerge } from 'tailwind-merge';

type LogoProps = {
    className?:string
}

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
            <img className={twMerge('w-24 h-24', className)} src={lightModeLogo} alt='scrummy_logo' />
        </>
    )
}

export function ScrummyDarkModeLogo({className} : LogoProps) {
    return (
        <>
            <img className={twMerge('w-24 h-24', className)} src={darkModeLogo} alt='scrummy_logo' />
        </>
    )
}