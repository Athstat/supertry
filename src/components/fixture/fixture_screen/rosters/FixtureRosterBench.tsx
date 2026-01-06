import { IRosterItem } from "../../../../types/games"
import SmartPlayerMugshot from "../../../player/SmartPlayerMugshot"
import RoundedCard from "../../../shared/RoundedCard"
import BottomSheetView from "../../../ui/BottomSheetView"
import CircleButton from "../../../ui/buttons/BackButton"
import { useState } from "react"
import { twMerge } from "tailwind-merge"
import { Maximize } from "lucide-react"
import { Minimize } from "lucide-react"
import { useAtomValue } from "jotai"
import { useAthleteMatchPr } from "../../../../hooks/athletes/useAthleteMatchPr"
import { useFixtureScreen } from "../../../../hooks/fixtures/useFixture"
import { fixtureAtom } from "../../../../state/fixtures/fixture.atoms"
import { SmallMatchPrCard } from "../../../rankings/MatchPrCard"

type Props = {
    bench: IRosterItem[]
}

/** Renders game roster bench */
export default function FixtureRosterBench({ bench }: Props) {

    const [expanded, setExpanded] = useState<boolean>(false);

    const toggle = () => {
        setExpanded(prev => !prev);
    }

    const benchSize = bench.length;

    return (
        <BottomSheetView
            hideHandle
            className={twMerge(
                "p-4 overflow-hidden max-h-[80px] min-h-[80px]",
                expanded && "max-h-[400px]",
                "transition-all delay-100 ease-linear"
            )}
        >
            <div className="flex flex-row items-center justify-between" >
                <div>
                    <p className="font-semibold" >Bench ({benchSize})</p>
                </div>

                <div>
                    <button onClick={toggle} className="flex flex-row gap-2 items-center" >
                        {!expanded && <p>Expand</p>}
                        {expanded && <p>Minimize</p>}

                        <CircleButton>
                            {!expanded && <Maximize className="w-4 h-4" />}
                            {expanded && <Minimize className="w-4 h-4" />}
                        </CircleButton>

                    </button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2" >
                {bench.map((r) => {
                    return (
                        <RosterBenchItem
                            item={r}
                            key={r.game_id}
                        />
                    )
                })}
            </div>
        </BottomSheetView>
    )
}

type RosterItemProps = {
    item: IRosterItem
}

function RosterBenchItem({ item }: RosterItemProps) {

    const { athlete, player_number } = item;
    const { openPlayerMatchModal } = useFixtureScreen();
    const fixture = useAtomValue(fixtureAtom);
    const { pr } = useAthleteMatchPr(item?.athlete.tracking_id, fixture?.game_id);

    const handleOnClick = () => {
        if (athlete && openPlayerMatchModal) {
            openPlayerMatchModal(athlete);
        }
    }

    return (
        <RoundedCard
            onClick={handleOnClick}
            className="p-2 bg-slate-200 cursor-pointer relative border-none flex flex-col items-center h-[100px] justify-center gap-2 flex-1"
            key={athlete.tracking_id}
        >

            <SmartPlayerMugshot
                url={athlete.image_url}
                teamId={athlete.team_id}
                className="hover:bg-transparent"
                playerImageClassName="hover:bg-white dark:hover:bg-slate-700 dark:bg-slate-600"
                
            />

            <p className="text-sm" >{player_number}. {athlete.athstat_firstname}</p>

            {pr && (
                <div className="absolute top-0 right-0" >
                    <SmallMatchPrCard
                        pr={pr.updated_power_ranking}
                        className="border-white dark:border-slate-900"
                        
                    />
                </div>
            )}
        </RoundedCard>
    )
}
