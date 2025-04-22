import { ThemeProvider, useTheme } from '../../contexts/ThemeContext'

export default function ScrummyLogo() {
    return (
        <ThemeProvider>
            <ThemedLogoWrapper />
        </ThemeProvider>
    )
}

function ThemedLogoWrapper() {

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
            <p>Dark Mode Logo</p>
        </>
    )
}