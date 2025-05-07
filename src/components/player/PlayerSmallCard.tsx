import { ReactNode, useState } from 'react'
import PlayerMugshot from '../shared/PlayerMugshot'
import { IBoxScore } from '../../types/boxScore'
import PlayerFixtureStatsModal from '../fixtures/AthleteFixtureStatsModal'
import { IFixture } from '../../types/games'

type Props = {
    children?: ReactNode,
    boxScore: IBoxScore,
    fixture: IFixture
}

export default function PlayerBoxScoreSmallCard({children, boxScore: bs, fixture} : Props) {

    const [showModal, setShow] = useState(false);
    const toogle = () => setShow(!showModal);

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
        <div className="flex flex-col cursor-pointer items-center justify-start gap-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 p-1 w-full" >

            <div onClick={toogle} className="flex flex-row items-center w-full gap-3 justify-start" >
                <PlayerMugshot className="w-10 h-10" url={bs.athlete_image_url} />

                <div className="flex flex-col gap-0" >

                    <div>
                        <p className="font-medium" >{bs.athlete_first_name} {bs.athlete_first_name} {bs.athlete_position ? `· ${fixPosition(bs.athlete_position)}` : ''    }</p>
                    </div>
                    
                    {children}
                </div>
            </div>

            <PlayerFixtureStatsModal fixture={fixture} boxScoreRecord={bs} open={showModal} onClose={toogle} />
        </div>
    )
}
