import { useState } from "react";
import useSWR from "swr";
import { djangoAthleteService } from "../../../services/athletes/djangoAthletesService";
import { IFixture } from "../../../types/games";
import { athleteNameSearchPredicate, formatPosition } from "../../../utils/athleteUtils";
import PlayerMugshot from "../../player/PlayerMugshot";
import { GameSportAction } from "../../../types/boxScore";

type Props = {
    search: string,
    boxScore: GameSportAction[],
    fixture: IFixture
}

export default function FixtureSearchResults({ search, boxScore, fixture }: Props) {

    const searchResults = boxScore.filter(bs => athleteNameSearchPredicate(bs.team_id , search));

    return (
        <div className="grid grid-cols-1 gap-3" >
            {searchResults.length === 0 && <div className="mt-4 text-center" >
                <p className="dark:text-slate-400 text-slate-700" >No Athletes Found</p>
            </div>}

            {searchResults.map((bs, index) => {
                return (
                    <ResultItem bs={bs} fixture={fixture} key={index} />
                )
            })}
        </div>
    )
}

type ResultItemProps = {
    bs: GameSportAction,
    fixture: IFixture
}

function ResultItem({ bs, fixture }: ResultItemProps) {

    const teamName = bs.team_id === fixture?.team?.athstat_id ?
        fixture.team.athstat_name : fixture?.opposition_team?.athstat_name;

    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    const athleteKey = `/athlete/${bs.athlete_id}`;
    const {data: athlete, isLoading} = useSWR(athleteKey, () => djangoAthleteService.getAthleteById(bs.athlete_id));
    
    if (isLoading) {
        return (
            <div>
                <p>Hie</p>
            </div>
        )
    }

    if (!athlete) return;

    return (
        <>
            <div onClick={toggle}  className="flex gap-3 flex-row items-center p-3 hover:bg-slate-200 rounded-xl dark:hover:bg-slate-800/40" >
                <div>
                    <PlayerMugshot url={athlete.image_url} className="w-14 h-14" />
                </div>
                <div >
                    <p className="font-medium" >{athlete.athstat_firstname} {athlete.athstat_lastname}</p>
                    <div className="dark:text-slate-400 text-slate-700 text-sm" >
                        <p>{teamName} · {formatPosition(athlete.position ?? "")}</p>
                    </div>
                </div>
            </div>

            {/* <PlayerFixtureStatsModal
                boxScoreRecord={bs}
                fixture={fixture}
                open={show}
                onClose={toggle}
            /> */}

        </>
    )
}