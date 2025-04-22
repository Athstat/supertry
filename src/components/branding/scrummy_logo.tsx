import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'

export default function ScrummyLogo() {
    const { theme } = useTheme();

    return (
        <>
            {theme === 'light' ? <ScrummyLightModeLogo /> : <ScrummyDarkModeLogo />}
        </>
    )
}

export function ScrummyLightModeLogo() {
    return (
        <>
            <p>Light Mode Logo</p>
        </>
    )
}

export function ScrummyDarkModeLogo() {
    return (
        <>
            <p className='text-white' >Dark Mode Logo</p>
        </>
    )
}