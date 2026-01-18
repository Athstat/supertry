import { CountrySelect } from "../CountrySelect";
import { TeamSelect } from "../TeamSelect";
import { useOnboarding } from "../../../hooks/onboarding/useOnboarding";


/** Renders the slide for the user to pick their favourite team */
export default function OnboardingFavouriteTeamSlide() {

  const {country, setCountry, favouriteTeams, setFavouriteTeams} = useOnboarding();

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
          value={favouriteTeams}
          onChange={setFavouriteTeams}
        />
      </div>

    </div>
  )
}
