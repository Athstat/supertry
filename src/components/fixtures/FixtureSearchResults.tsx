import { useState } from "react";
import { IBoxScoreItem } from "../../types/boxScore"
import { IFixture } from "../../types/games";
import { athleteSearchPredicate, formatPosition } from "../../utils/athleteUtils";
import PlayerMugshot from "../shared/PlayerMugshot";
import PlayerFixtureStatsModal from "./PlayerFixtureStatsModal";

type Props = {
    search: string,
    boxScore: IBoxScoreItem[],
    fixture: IFixture
}

export default function FixtureSearchResults({ search, boxScore, fixture }: Props) {

    const searchResults = boxScore.filter(bs => athleteSearchPredicate(bs.athlete, search));

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
    bs: IBoxScoreItem,
    fixture: IFixture
}

function ResultItem({ bs, fixture }: ResultItemProps) {

    const teamName = bs.athlete.team.athstat_id === fixture.team.athstat_id ?
        fixture.team.athstat_name : fixture.competition_name;

    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);
    
    return (
        <>
            <div onClick={toggle}  className="flex gap-3 flex-row items-center p-3 hover:bg-slate-200 rounded-xl dark:hover:bg-slate-800/40" >
                <div>
                    <PlayerMugshot url={bs.athlete.image_url} className="w-14 h-14" />
                </div>
                <div >
                    <p className="font-medium" >{bs.athlete.athstat_firstname} {bs.athlete.athstat_lastname}</p>
                    <div className="dark:text-slate-400 text-slate-700 text-sm" >
                        <p>{teamName} · {formatPosition(bs.athlete.position ?? "")}</p>
                    </div>
                </div>
            </div>

            <PlayerFixtureStatsModal
                boxScoreRecord={bs}
                fixture={fixture}
                open={show}
                onClose={toggle}
                
            />

        </>
    )
}