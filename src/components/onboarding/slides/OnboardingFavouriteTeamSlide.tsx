import { useState } from "react";
import { CountrySelect } from "../CountrySelect";
import { Country, countryFlags } from "../../../types/countries";
import { TeamSelect } from "../TeamSelect";
import { IProTeam } from "../../../types/team";
import { useGeoLocation } from "../../../hooks/web/useGeoLocation";


/** Renders the slide for the user to pick their favourite team */
export default function OnboardingFavouriteTeamSlide() {

  const {userLocation} = useGeoLocation();

  const defaultCountry: Country | undefined = countryFlags.find((c) => {
    return c.code === userLocation?.country_code;
  })

  const [country, setCountry] = useState<Country | undefined>(defaultCountry);
  const [selectedTeams, setSelectedTeams] = useState<IProTeam[]>([]);

  return (
    <div className="flex flex-col items-start justify-start w-full gap-8" >
      <div className="flex flex-col items-center justify-center w-full" >
        <p className="font-bold text-2xl" >Lets get you locked in!</p>
      </div>

      <div className="flex flex-col gap-3 w-full" >

        <div>
          <p className="font-semibold" >Where are you based?</p>
        </div>

        <CountrySelect 
          value={country}
          onChange={setCountry}
          className="w-full"
        />
      </div>

      <div className="flex flex-col gap-3 w-full" >
        <div>
          <p>Whats your favourite rugby team?</p>
        </div>

        <TeamSelect 
          value={selectedTeams}
          onChange={setSelectedTeams}
        />
      </div>

    </div>
  )
}
