import { useEffect, useState } from "react"
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups"
import { countryFlags } from "../../types/countries";
import EditLeagueHeaderOverlay from "./header/EditLeagueHeaderOverlay";

type Props = {
  league?: FantasyLeagueGroup
}

export default function LeagueGroupBanner({league} : Props) {

  const [error,setError] = useState(false);

  const defaultCountryBannerUrl = getCountryDefaultBanner(league);
  const bannerUrl = league?.banner || defaultCountryBannerUrl;

  useEffect(() => {
    setError(false);
  }, [bannerUrl]);

  const altTitle = league?.title ?? "League";

  if (bannerUrl && !error) {
    return (
      <div className="w-full max-h-[250px] min-h-[150px] overflow-clip" >
        <img 
          onError={() => setError(true)}
          src={bannerUrl}
          alt={`${altTitle} Banner`}
          className="w-full h-full"
        />
      </div>
    )
  }

  return (
    <div className="w-full h-[150px]  bg-slate-200 dark:bg-slate-700" >
      <EditLeagueHeaderOverlay />
    </div>
  )
}

function getCountryDefaultBanner(league?: FantasyLeagueGroup) {
  const country = countryFlags.find((c) => {
    const matchesWhole = league?.title?.toLowerCase() === c.name.toLowerCase();
    const matchesFanLeague = league?.title?.endsWith("Fans") && league?.title.toLowerCase().startsWith(c.name.toLowerCase())
    return matchesWhole || matchesFanLeague;
  })

  if (country) {
    return `https://dp7xhssw324ru.cloudfront.net/country_banners_${country.code.toLowerCase()}.png`;
  }

  return undefined;
}