import { useState } from 'react'
import { twMerge } from 'tailwind-merge';
import { getCountryFlagImageUrl } from '../../../utils/countryUtils';

type Props = {
    countryCode?: string,
    className?: string
}

export default function CountryFlag({ countryCode, className }: Props) {
    const [error, setError] = useState<boolean>(false);
    const imageUrl = getCountryFlagImageUrl(countryCode || '');

    if (!error && imageUrl) {
        return (
            <div
                className={twMerge(
                    "min-w-9 min-h-9 cursor-pointer relative overflow-clip flex flex-col items-center justify-center",
                    className
                )}
            >
                <img
                    onError={() => setError(true)}
                    src={imageUrl}
                    className="object-scale-down"
                    alt='league_logo'
                />
            </div>
        )
    }

    return null;
}
