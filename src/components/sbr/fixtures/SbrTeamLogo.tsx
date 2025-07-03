import { Shield } from "lucide-react"
import { useState } from "react";
import { twMerge } from "tailwind-merge"

type Props = {
  teamName?: string,
  className?: string
}

export default function SbrTeamLogo({ teamName, className }: Props) {

  const logoUrl = teamLogoMapper(teamName || "");
  const [error, setError] = useState(false);

  if (logoUrl && !error) {
    return (
      <img
        src={logoUrl}
        alt={teamName}
        onError={() => setError(true)}
        className={twMerge(
          "w-8 h-8 object-contain",
          className
        )}
      />
    )
  }


  return (
    <>
      <Shield className={twMerge(
        "w-8 h-8 text-slate-400 dark:text-slate-400",
        className
      )} />
    </>
  )
}


function teamLogoMapper(teamName: string): string | undefined {

  const publicPath = '/sbr_logos';

  const getLogoFileName = () => {
    switch (teamName) {
      case 'Christian Brothers College':
        return 'christian-brothers-college-bulawayo.png.png';
      case 'Falcon College':
        return 'falcon-college.png.png';
      case 'Gateway High School':
        return 'gateway.png.png';
      case 'Hellenic Academy':
        return 'hellenic.png.png';
      case 'Heritage':
      case 'Hattie College':
        return 'heritage.png.png';
      case 'Kyle College':
        return 'kyle-college-vikings.png.png';
      case 'Lomagundi College':
        return 'lomagundi.png.png';
      case 'Peterhouse Boys':
        return 'peterhouse.png.png';
      case 'Prince Edward School':
      case 'Prince Edward 2nd':
        return 'prince-edwards.png.png';
      case 'St George’s College':
      case 'St George’s 3rd':
        return 'st-georges.png.png';
      case "St John's College":
        return 'st-johns-college.png.png';
      case 'Watershed College':
        return 'watershed.png.png';
      case 'Nattie College':
        return 'nattie_college.webp';
      case 'Rydings College':
        return 'rydings.webp';

      case 'Hillcrest College (ZIM)':
      case 'Hillcrest College':
        return 'hilcrest.webp';
      case 'Wise Owl Marondera':
        return 'wise_owl.webp';
      case 'Churchill Boys High':
        return 'church_hill.webp';
      case 'Maritzburg College':
        return 'maritzburg.webp'
      case "Westville Boy's High School":
        return 'westville.webp'
      case "Michaelhouse":
        return 'michaelhouse.webp'
      case "Northwood School":
        return 'northwood.webp'
      case "Hilton College":
        return 'hilton_college.webp'
      case "Glenwood High School":
        return 'glenwood.webp'
      case "Kearsney College":
        return 'kearseny.webp'
      case "Durban High School":
        return 'durban_high.webp'
      case "Dundee High School":
        return 'dundee.webp'
      case "Greytown High School":
        return 'greytown.webp'
      case 'Midlands Christian College':
        return 'midlands-christian-college.png.png';
      case 'Milton high school':
        return 'milton_high_logo.webp'
      case 'Eaglesvale High School':
        return 'eaglesvale_logo.webp';
      case 'Sharks Schools':
        return 'sharks_schools_logo.png';
      case 'Blue Bulls Schools':
        return 'blue_bulls_schools_logo.png';
      case 'Benard Mizeki College':
        return 'bernard_muzeki_logo.png';
      case 'Mutare Boys High':
        return 'mutare_boys_high_logo.jpeg';
      case 'Petra College':
        return 'petra_college_logo.png'
      case 'Allan Wilson':
        return 'allan_wilson_logo.png'
      case 'St Stithians College':
        return 'st_stithians_logo.png'
      case 'Hillcrest High School (SA)':
        return 'hilcrest_high_school_sa.png'
      case 'Howick High School':
        return 'howick_logo.png';
      default:
        return undefined;
    }
  }
  
  const fileName = getLogoFileName();

  if (fileName === undefined) return undefined;
  const finalPath = `${publicPath}/${fileName}`;

  return finalPath;

}
