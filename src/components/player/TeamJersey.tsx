import { useState } from 'react'
import { getTeamJerseyImage } from '../../utils/athleteUtils'
import { twMerge } from 'tailwind-merge';
import { ScrummyDarkModeLogo } from '../branding/scrummy_logo';

type Props = {
    teamId?: string | number,
    className?: string,
    hideFade?: boolean,
    useBaseClasses?: boolean,
    scummyLogoClassName?: string
}

export default function TeamJersey({ teamId, className, hideFade, useBaseClasses = true, scummyLogoClassName }: Props) {

    const imageUrl = teamId ? getTeamJerseyImage(teamId) : undefined;
    const [error, setError] = useState<boolean>(false);

    console.log("Image URL ", imageUrl);

    if (error || imageUrl === undefined) {
        return (
            <div>
                <ScrummyDarkModeLogo
                    className={twMerge(
                        'opacity-20 grayscale',
                        className,
                        scummyLogoClassName
                    )}
                />
            </div>
        )
    }


    return (

        <img
            src={imageUrl}
            className={twMerge(
                useBaseClasses && 'min-h-[80px] max-h-[80px] min-w-[80px] max-w-[80px] object-cover object-top',
                useBaseClasses && 'lg:min-h-[120px] lg:max-h-[120px] lg:min-w-[120px] lg:max-w-[120px]',
                !hideFade && '[mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                !hideFade && '[mask - repeat:no-repeat] [mask-size:100%_100%]',
                !hideFade && '[-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                !hideFade && '[-webkit-mask-repeat:no-repeat]',
                !hideFade && '[-webkit-mask-size:100%_100%',
                className
            )}
            onError={() => setError(true)}
        />

    )
}