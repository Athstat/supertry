import { createContext, ReactNode } from "react"
import { UserLocation } from "../types/web"
import { geolocationService } from "../services/web/geolocationService";
import ScrummyLoadingState from "../components/ui/ScrummyLoadingState";
import useSWRImmutable from 'swr/immutable';

type GeoLocationContextProps = {
    userLocation?: UserLocation
}

type ProviderProps = {
    children?: ReactNode
}

export const GeoLocationContext = createContext<GeoLocationContextProps | null>(null);

/** Renders Geo Location Provider */
export default function GeoLocationProvider({children} : ProviderProps) {

    const key = `/geolocation`;
    const { data: userLocation, isLoading } = useSWRImmutable(key, () => geolocationService.getLocation());

    if (isLoading) {
        return (
            <ScrummyLoadingState />
        )
    }

    return (
        <GeoLocationContext.Provider
            value={{userLocation}}
        >
            {children}
        </GeoLocationContext.Provider>
    )
}