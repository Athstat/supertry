import useSWR from "swr";
import { IFixture } from "../../../types/games"
import { fixtureSummary } from "../../../utils/fixtureUtils"
import { swrFetchKeys } from "../../../utils/swrKeys";
import { gamesService } from "../../../services/gamesService";
import { useAthlete } from "../../../hooks/athletes/useAthlete";
import RoundedCard from "../../shared/RoundedCard";
import { Star } from "lucide-react";
import SmartPlayerMugshot from "../../player/SmartPlayerMugshot";
import SecondaryText from "../../shared/SecondaryText";
import MatchPrCard from "../../rankings/MatchPrCard";

type Props = {
    fixture: IFixture
}

/** Renders fixture man of the match card */
export default function FixturePotmCard({ fixture }: Props) {

    const { matchFinal } = fixtureSummary(fixture);

    const key = matchFinal ? swrFetchKeys.getFixturePotm(fixture.game_id) : null;
    const { data: potm, isLoading: loadingPotm } = useSWR(key, () => gamesService.getFixturePotm(fixture.game_id))

    const potmId = potm?.athlete_id;
    const { athlete, isLoading: loadingAthlete } = useAthlete(potmId);

    const isLoading = loadingPotm || loadingAthlete;

    if (!matchFinal) {
        return null;
    }

    if (isLoading) {
        return (
            <RoundedCard className="w-full h-[100px] dark:border-none animate-pulse" >

            </RoundedCard>
        )
    }

    if (!athlete || !potm) {
        return null;
    }

    return (
        <RoundedCard className="relative flex dark:border-none overflow-clip flex-col gap-2 h-[110px]" >

            <div className="opacity-5 w-full flex flex-row items-center justify-end h-full" >
                <div className="flex flex-row items-center justify-end flex-wrap h-full w-[160px]" >
                    {Array.from([0,0,0,0,0,0,0,0, 0, 0, 0,0,0]).map((x, index) => {
                        return (
                            <div key={x + index} >
                                <Star className="text-yellow-500" />
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="absolute top-0 left-0 p-4 w-full flex flex-col gap-2" >
                <div className="flex flex-row items-center gap-1" >
                    <Star className="text-yellow-500 w-4 h-4" />
                    <p className="font-semibold text-sm" >SCRUMMY Player of The Match</p>
                </div>

                <div className="flex flex-row items-center justify-between" >
                    <div className="flex flex-row items-center gap-2" >

                        {athlete.image_url && <div>
                            <SmartPlayerMugshot
                                url={athlete?.image_url}
                                teamId={athlete?.team_id}
                            />
                        </div>}

                        <div>
                            <p>{athlete.player_name}</p>
                            <SecondaryText className="" >{athlete.team?.athstat_name}</SecondaryText>
                        </div>

                    </div>

                    <div className="flex flex-col items-center gap-1" >
                        <MatchPrCard
                            pr={potm.updated_power_ranking}
                        />
                        <SecondaryText className="text-xs" >Rating</SecondaryText>
                    </div>
                </div>
            </div>
        </RoundedCard>
    )
}
