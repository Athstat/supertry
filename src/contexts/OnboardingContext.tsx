import { createContext, ReactNode, useState } from "react"
import { Country, countryFlags } from "../types/countries"
import { OnboardingFavouriteTeam } from "../types/onboarding"
import { useGeoLocation } from "../hooks/web/useGeoLocation"
import { useInternalUserProfile } from "../hooks/auth/useInternalUserProfile"

type OnboardingContextType = {
    favouriteTeams: OnboardingFavouriteTeam[],
    setFavouriteTeams: (teams: OnboardingFavouriteTeam[]) => void,
    country?: Country,
    setCountry: (country: Country) => void
}

export const OnboardingContext = createContext<OnboardingContextType | null>(null);

type ProviderProps = {
    children?: ReactNode
}

/** Provides a onboarding context to child components */
export default function OnboardingProvider({ children }: ProviderProps) {
    
    const { userLocation } = useGeoLocation();
    const {internalProfile} = useInternalUserProfile();

    const previousCountry = countryFlags.find((c) => {
        return c.name === internalProfile?.country;
    });

    const defaultCountry: Country | undefined = countryFlags.find((c) => {
        return c.code === userLocation?.country_code;
    })

    const [country, setCountry] = useState<Country | undefined>(previousCountry || defaultCountry);
    const [favouriteTeams, setFavouriteTeams] = useState<OnboardingFavouriteTeam[]>([]);

    return (
        <OnboardingContext.Provider
            value={{
                country,
                setCountry,
                favouriteTeams,
                setFavouriteTeams
            }}
        >
            {children}
        </OnboardingContext.Provider>
    )
}
