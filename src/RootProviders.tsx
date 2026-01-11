import { GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorInfo, ReactNode, useEffect, useState } from "react"
import ErrorBoundary, { FallbackProps } from "./components/ui/navigation/ErrorBoundary";
import NetworkStatusProvider from "./components/network/NetworkStatusProvider";
import SportActionsDefinitionsProvider from "./providers/SportActionsDefinitionsProvider";
import { AppStateProvider } from "./contexts/AppStateContext";
import { AthleteProvider } from "./contexts/AthleteContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AuthTokenProvider from "./providers/AuthTokenProvider";
import NavigationBarsProvider from "./providers/navigation/NavigationBarsProvider";
import BrowserHistoryProvider from "./providers/web/BrowserHistoryProvider";
import { useSyncDeviceId } from "./hooks/auth/useSyncDeviceId";
import FantasySeasonsProvider from "./providers/fantasy_seasons/FantasySeasonsProvider";
import CacheProvider from "./providers/caching/CacheProvider";
import AppErrorFallback from "./components/ui/navigation/AppErrorFallback";
import TooltipProvider from "./providers/ui/TooltipProvider";
import { useInterceptBrowserBack } from "./hooks/web/useInterceptBrowserBack";
import { twMerge } from "tailwind-merge";
import { AppColours } from "./types/constants";

type Props = {
    children?: ReactNode
}

/** Difines all the root providers to its children */
export default function RootProviders({ children }: Props) {

    useInterceptBrowserBack();

    useEffect(() => {
        document.body.className = twMerge(
            AppColours.BACKGROUND,
            "w-screen h-screen"
        );
    }, []);

    return (
        <ThemeLayer>
            <CacheProvider>
                <AuthenticationLayer>
                    <DataLayer>
                        <AppStateLayer>
                            <NavigationLayer>
                                {children}
                            </NavigationLayer>
                        </AppStateLayer>
                    </DataLayer>
                </AuthenticationLayer>
            </CacheProvider>
        </ThemeLayer>
    )
}

function DeviceIdSync() {
    useSyncDeviceId();
    return null;
}

/** Groups Authentication Layer Providers */
function AuthenticationLayer({ children }: Props) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'fall-back-client-id';

    return (
        <GoogleOAuthProvider
            clientId={clientId}
        >
            <AuthTokenProvider>
                <AuthProvider>
                    <DeviceIdSync />
                    {children}
                </AuthProvider>
            </AuthTokenProvider>
        </GoogleOAuthProvider>
    )
}

/** Groups Navigation Layer providers */
function NavigationLayer({ children }: Props) {
    return (
        <BrowserHistoryProvider>
            <NavigationBarsProvider>
                {children}
            </NavigationBarsProvider>
        </BrowserHistoryProvider>
    )
}

/** Provides provider's related to fetching data */
function DataLayer({ children }: Props) {

    return (
        <FantasySeasonsProvider>
            <AthleteProvider>
                <SportActionsDefinitionsProvider>
                    {children}
                </SportActionsDefinitionsProvider>
            </AthleteProvider>
        </FantasySeasonsProvider>
    )
}


/** Groups app state layer providers */
function AppStateLayer({ children }: Props) {

    const [, setError] = useState<Error>();

    const handleError = (err: Error, errorInfo: ErrorInfo) => {
        console.error('Root level error caught:', err, errorInfo);
        setError(err);
    }

    return (
        <NetworkStatusProvider>
            <AppStateProvider>
                <ErrorBoundary
                    onError={handleError}
                    fallback={(props: FallbackProps) => <AppErrorFallback {...props} />}
                >
                    <TooltipProvider>
                        {children}
                    </TooltipProvider>
                </ErrorBoundary>
            </AppStateProvider>
        </NetworkStatusProvider>
    )
}

/** Groups Theme Layers together */
function ThemeLayer({ children }: Props) {
    return (
        <ThemeProvider>
            {children}
        </ThemeProvider>
    )
}