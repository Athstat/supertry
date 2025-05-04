import { Shield } from 'lucide-react'
import { useState } from 'react';
import { twMerge } from 'tailwind-merge'

type Props = {
    teamId?: string,
    alt?: string
}

export default function TeamLogo({ teamId, alt }: Props) {

    const imageUrl = getTeamLogoUrl(teamId ?? "team_id");
    const [error, setError] = useState(false);

    console.log("teamId", teamId);
    console.log("team logo url", imageUrl);

    if (error || !teamId) {
        return (
            <Shield className="w-14 h-14 text-slate-300 dark:text-slate-600 rounded-md flex items-center justify-center"/>
        )
    }

    return (
        <div className={twMerge("w-14 h-14")} >
            <img 
                src={imageUrl}
                alt={alt ?? "team_logo"}
                onError={(e) => setError(true)} 
            />
        </div>
    )
}


function getTeamLogoUrl(teamId: string) {
    const baseUrl = `https://athstat-landing-assets-migrated.s3.amazonaws.com/team_logos`;
    return `${baseUrl}/${teamId}.png`;
}
