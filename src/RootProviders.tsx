import { GoogleOAuthProvider } from "@react-oauth/google";
import { ErrorInfo, ReactNode, useState } from "react"
import AppErrorFallback from "./components/AppErrorFallback";
import ErrorBoundary, { FallbackProps } from "./components/ErrorBoundary";
import NetworkStatusProvider from "./components/network/NetworkStatusProvider";
import SportActionsDefinitionsProvider from "./components/stats/SportActionsDefinitionsProvider";
import { AppStateProvider } from "./contexts/AppStateContext";
import { AthleteProvider } from "./contexts/AthleteContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PlayerProfileProvider } from "./hooks/usePlayerProfile";
import AuthTokenProvider from "./providers/AuthTokenProvider";
import NavigationBarsProvider from "./providers/navigation/NavigationBarsProvider";
import BrowserHistoryProvider from "./providers/web/BrowserHistoryProvider";
import { useSyncDeviceId } from "./hooks/auth/useSyncDeviceId";
import FantasySeasonsProvider from "./components/dashboard/provider/FantasySeasonsProvider";

type Props = {
    children?: ReactNode
}

/** Difines all the root providers to its children */
export default function RootProviders({ children }: Props) {



    return (
        <ThemeLayer>
            {/* Ensure Authentication and data providers are mounted before AppStateProvider
                so AppState can safely consume contexts like AthleteContext */}
            <AuthenticationLayer>
                <DataLayer>
                    <AppStateLayer>
                        <NavigationLayer>
                            {children}
                        </NavigationLayer>
                    </AppStateLayer>
                </DataLayer>
            </AuthenticationLayer>
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
                    <PlayerProfileProvider>
                        {children}
                    </PlayerProfileProvider>
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
                    {children}
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