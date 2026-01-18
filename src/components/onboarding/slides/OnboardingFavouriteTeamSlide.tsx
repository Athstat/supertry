import { CountrySelect } from "../CountrySelect";


/** Renders the slide for the user to pick their favourite team */
export default function OnboardingFavouriteTeamSlide() {
  return (
    <div>
      <div className="bg-red-500" >
        <CountrySelect 
          value={undefined}
          onChange={() => {}}
        />
      </div>
    </div>
  )
}
