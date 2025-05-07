import { ReactNode } from 'react'
import PlayerMugshot from '../shared/PlayerMugshot'

type Props = {
    children?: ReactNode,
    firstName?: string,
    lastName?: string,
    position?: string,
    imageUrl?: string
}

export default function PlayerSmallCard({children, firstName, lastName, position, imageUrl} : Props) {

    const fixPosition = (inStr: string) => {
        const parts = inStr.split("-");
        let outStr = "";

        parts.forEach((part) => {
            const partNormalised = part[0].toUpperCase() + part.slice(1);
            outStr += partNormalised + " ";
        });

        return outStr
    }

    return (
        <div className="flex flex-col items-center justify-start gap-2" >

            <div className="flex flex-row items-center w-full gap-3 justify-start" >
                <PlayerMugshot className="w-10 h-10" url={imageUrl} />

                <div className="flex flex-col gap-0" >

                    <div>
                        <p className="font-medium" >{firstName} {lastName} {position ? `· ${fixPosition(position)}` : ''    }</p>
                    </div>
                    
                    {children}
                </div>
            </div>
        </div>
    )
}
