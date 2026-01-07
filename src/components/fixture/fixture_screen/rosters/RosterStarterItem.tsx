import { useAtomValue } from "jotai";
import { useAthleteMatchPr } from "../../../../hooks/athletes/useAthleteMatchPr";
import { useFixtureScreen } from "../../../../hooks/fixtures/useFixture";
import { fixtureAtom } from "../../../../state/fixtures/fixture.atoms";
import { IRosterItem } from "../../../../types/games";
import TeamJersey from "../../../player/TeamJersey";
import { SmallMatchPrCard } from "../../../rankings/MatchPrCard";
import PlayerMugshot from "../../../player/PlayerMugshot";
import { Activity, useMemo } from "react";
import { twMerge } from "tailwind-merge";

type RosterItemProps = {
    item?: IRosterItem,
    className?: string
}

/** Renders pitch view, roster starter item */
export function RosterStarterItem({ item, className }: RosterItemProps) {

    const {openPlayerMatchModal} = useFixtureScreen();
    const fixture = useAtomValue(fixtureAtom);
    const {pr} = useAthleteMatchPr(item?.athlete.tracking_id, fixture?.game_id);

    const onClick = () => {
        if (item?.athlete) {
            openPlayerMatchModal(item?.athlete);
        }
    }

    const playerFullName = useMemo(() => {
        if (!item) {
            return '';
        }

        const {athlete} = item;

        if (athlete) {
            const {athstat_lastname} = athlete;
            return athstat_lastname || ""; 
        }
    }, [item]);

    return (
        <div
            key={item?.athlete.tracking_id}
            className=""
            onClick={onClick}
        >
            {item && <div className={twMerge(
                "flex flex-col items-center justify-center relative",
                className
            )} >

                <Activity mode={item.athlete.image_url ? "visible" : "hidden"} >
                    <PlayerMugshot
                        url={item.athlete.image_url}
                        teamId={item.team_id}
                        className="border-2 border-green-500 dark:border-green-500/40 bg-green-800 dark:bg-green-600 w-16 h-16 hover:bg-green-400"
                        useBaseClassNameForJersey={false}
                        jerseyClassName="border-2 border-green-500 dark:border-green-500/40 bg-green-800 dark:bg-green-600 w-20 h-20 hover:bg-green-400"
                        
                    />
                </Activity>

                <Activity mode={item.athlete.image_url ? "hidden" : "visible"} >
                    <div className="max-w-16 bg-green-800 dark:bg-green-600 max-h-16 min-w-16 min-h-16 flex flex-col items-center rounded-full overflow-hidden border-2 border-green-200/40 dark:border-green-500/20 " >
                        <TeamJersey
                            teamId={item.athlete.team_id}
                            className="w-full max-h-[60px] max-w-[60px] min-h-[60px] min-w-[60px] object-center mt-3 h-full"
                            hideFade
                        />
                    </div>
                </Activity>

                <p className="text-[10px] text-white font-medium max-w-[100px] truncate" >{item.player_number}. {playerFullName}</p>

                {pr && (
                    <div className="absolute top-0 right-0" >
                        <SmallMatchPrCard 
                        pr={pr.updated_power_ranking}
                        />
                    </div>
                )}
            </div>}
        </div>
    )
}