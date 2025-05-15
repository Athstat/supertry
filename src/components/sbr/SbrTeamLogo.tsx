import { Shield } from "lucide-react"
import { twMerge } from "tailwind-merge"

type Props = {
    teamName?: string,
    className?: string
}

export default function SbrTeamLogo({ teamName, className }: Props) {

    const logoUrl = teamLogoMapper(teamName || "");

    if (logoUrl) {
        return (
            <img
                src={logoUrl}
                alt={teamName}
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
  switch (teamName) {
    case 'CBC':
      return '/sbr_logos/christian-brothers-college-bulawayo.png.png';
    case 'Falcon College':
      return '/sbr_logos/falcon-college.png.png';
    case 'Gateway High School':
      return '/sbr_logos/gateway.png.png';
    case 'Hellenic Academy':
      return '/sbr_logos/hellenic.png.png';
    case 'Heritage':
    case 'Hattie College':
      return '/sbr_logos/heritage.png.png';
    case 'Kyle College':
      return '/sbr_logos/kyle-college-vikings.png.png';
    case 'Lomagundi College':
      return '/sbr_logos/lomagundi.png.png';
    case 'Peterhouse Boys':
      return '/sbr_logos/peterhouse.png.png';
    case 'Prince Edward School':
      return '/sbr_logos/prince-edwards.png.png';
    case 'St George’s College':
      return '/sbr_logos/st-georges.png.png';
    case "St John's College":
      return '/sbr_logos/st-johns-college.png.png';
    case 'Watershed College':
      return '/sbr_logos/watershed.png.png';
    case 'Nattie College':
        return '/sbr_logos/nattie_college.webp';
    case 'Rydings College':
        return '/sbr_logos/rydings.webp';

    case 'Hillcrest College':
        return '/sbr_logos/hilcrest.webp';
    case 'Wise Owl Marondera':
        return 'public/sbr_logos/wise_owl.webp';
    case 'Churchill Boys High':
        return 'public/sbr_logos/church_hill.webp';
    default:
      return undefined;
  }
}
