import { useState } from 'react'
import { getTeamJerseyImage } from '../../utils/athleteUtils'
import { twMerge } from 'tailwind-merge';
import { ScrummyDarkModeLogo } from '../branding/scrummy_logo';

type Props = {
    teamId?: string | number,
    className?: string,
    hideFade?: boolean,
    useBaseClasses?: boolean,
    scummyLogoClassName?: string,
    eclipseJersey?: boolean
}

export default function TeamJersey({ teamId, className, hideFade, useBaseClasses = true, scummyLogoClassName, eclipseJersey }: Props) {

    const imageUrl = teamId ? getTeamJerseyImage(teamId) : undefined;
    const [error, setError] = useState<boolean>(false);

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
        <div
            className={twMerge(
                useBaseClasses && 'min-h-[80px] max-h-[80px] min-w-[80px] max-w-[80px]',
                useBaseClasses && 'lg:min-h-[120px] lg:max-h-[120px] lg:min-w-[120px] lg:max-w-[120px]',
                eclipseJersey && 'jersey-eclipse',
                className
            )}
        >
            <img
                src={imageUrl}
                className={twMerge(
                    'w-full h-full object-cover object-top',
                    eclipseJersey && 'scale-y-[1.08] translate-y-2',
                    !hideFade && !eclipseJersey && '[mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                    !hideFade && !eclipseJersey && '[mask-repeat:no-repeat] [mask-size:100%_100%]',
                    !hideFade && !eclipseJersey && '[-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                    !hideFade && !eclipseJersey && '[-webkit-mask-repeat:no-repeat]',
                    !hideFade && !eclipseJersey && '[-webkit-mask-size:100%_100%]'
                )}
                onError={() => setError(true)}
            />
        </div>
    )

}