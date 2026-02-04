import { createContext, ReactNode } from "react"
import useSWRImmutable from 'swr/immutable';
import ScrummyLoadingState from "../../components/ui/ScrummyLoadingState";
import { geolocationService } from "../../services/web/geolocationService";
import { UserLocation } from "../../types/web";

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