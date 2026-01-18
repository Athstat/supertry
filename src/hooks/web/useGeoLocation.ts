import { useContext } from "react";
import { GeoLocationContext } from "../../contexts/GeoLocationContext";

export function useGeoLocation() {
    const context = useContext(GeoLocationContext);
    
    if (!context) {
        throw new Error('useGeoLocation() should be used inside the GeoLocationProvider')
    }
    
    return context;
}