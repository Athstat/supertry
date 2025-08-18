import { useState } from 'react'
import { getTeamJerseyImage } from '../../utils/athleteUtils'
import { twMerge } from 'tailwind-merge';
import { ScrummyDarkModeLogo } from '../branding/scrummy_logo';

type Props = {
    teamId?: string
}

export default function TeamJersey({ teamId }: Props) {

    const imageUrl = teamId ? getTeamJerseyImage(teamId) : undefined;
    const [error, setError] = useState<boolean>(false);

    if (error || imageUrl === undefined) {
        return (
            <ScrummyDarkModeLogo
                className='opacity-20 grayscale'
            />
        )
    }


    return (

        <img
            src={imageUrl}
            className={twMerge(
                'min-h-[100px] max-h-[100px] min-w-[100px] max-w-[100px] object-cover object-center translate-',
                "[mask-image:linear-gradient(to_bottom,black_80%,transparent)]",
                "[mask - repeat:no-repeat] [mask-size:100%_100%]",
                "[-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)]",
                "[-webkit-mask-repeat:no-repeat]",
                "[-webkit-mask-size:100%_100%"
            )}
            onError={() => setError(true)}
        />

    )
}