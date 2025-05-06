import { Shield } from 'lucide-react'
import { useState } from 'react';
import { twMerge } from 'tailwind-merge'

type Props = {
    url?: string,
    alt?: string,
    className?: string
}

export default function TeamLogo({ url, alt, className }: Props) {

    const imageUrl = url;
    const [error, setError] = useState(false);

    if (error || !url) {
        return (
            <Shield className={twMerge(
                "w-14 h-14 text-slate-300 dark:text-slate-600 rounded-md flex items-center justify-center",
                className
            )}/>
        )
    }

    return (
        <div className={twMerge("w-14 h-14 overflow-clip ", className)} >
            <img 
                src={imageUrl}
                alt={alt ?? "team_logo"}
                onError={(e) => setError(true)} 
                className='w-full h-full object-contain'
            />
        </div>
    )
}