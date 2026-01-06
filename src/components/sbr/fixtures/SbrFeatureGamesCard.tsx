import { useAtomValue } from "jotai"
import { sbrWeekFeatureGamesAtom } from "../../../state/sbrFixtures.atoms"
import { Swords } from "lucide-react";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import { useState } from "react";
import { ISbrFixture } from "../../../types/sbr";
import DialogModal from "../../shared/DialogModal";
import SbrTeamLogo from "./SbrTeamLogo";
import { hasMotmVotingEnded, sbrFixtureSummary } from "../../../utils/sbrUtils";
import SbrFixturePredictionBox from "../predictions/SbrFixturePredictionBox";
import SbrMotmVotingBox from "../motm/SbrMotmVotingBox";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";

/** Renders a card of the feature games for a specific week */
export default function SbrFeatureGamesCard() {

    const featureGames = useAtomValue(sbrWeekFeatureGamesAtom);
    const isFeatureGamesEmpty = featureGames.length === 0;

    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    const fixturesVotingEndedCount = featureGames.reduce((prev, f) => {
        const hasVotingEnded = hasMotmVotingEnded(f.kickoff_time);
        return prev + (hasVotingEnded ? 1 : 0);
    }, 0);

    const hasVotingEndedForAll = fixturesVotingEndedCount === featureGames.length;

    if (isFeatureGamesEmpty) {
        return null;
    }


    return (
        <RoundedCard className="flex flex-col gap-4 p-4" >

            <div className="flex flex-row items-center gap-2" >
                <Swords className="w-5 h-5" />
                <h1 className="text-md lg:text-lg font-bold" >Feature Games</h1>
            </div>
            <SecondaryText className="text-sm lg:text-base" >Predict who will win and vote for your <strong>Top Dawg Of the Game</strong> on this weeks feature games!</SecondaryText>

            <div className="flex flex-row items-center gap-4 my-2" >
                {featureGames.map((g ) => {
                    return (

                        <>
                            {/* <div key={index} className="flex bg-slate-100/40 dark:bg-slate-700/40 w-14 h-14 p-1 rounded-full flex-row items-center justify-center gap-2" > */}
                                <SbrTeamLogo key={g.home_team_id} teamName={g.home_team} />
                            {/* </div> */}
                            <p>vs</p>
                            {/* <div key={index} className="flex bg-slate-100/40 dark:bg-slate-700/40 w-14 h-14 p-1 rounded-full flex-row items-center justify-center gap-2" > */}
                                <SbrTeamLogo key={g.away_votes} teamName={g.away_team} />
                            {/* </div> */}
                        </>
                    )
                })}
            </div>

            <PrimaryButton  onClick={toggle} >{hasVotingEndedForAll ? "View Results" : "Predict & Vote"}</PrimaryButton>

            <SbrFeatureGamesModal open={show} onClose={toggle} games={featureGames} />

        </RoundedCard>
    )
}

type ModalProps = {
    games: ISbrFixture[],
    open?: boolean,
    onClose?: () => void
}

function SbrFeatureGamesModal({ games, open, onClose }: ModalProps) {

    const maxIndex = games.length - 1;
    const [index, setIndex] = useState(0);

    const currentGame = games[index];

    const { hasScores } = sbrFixtureSummary(currentGame);

    const canMoveNext = index < maxIndex;
    const canMovePrev = index > 0;

    const handleMoveNextFixture = () => {
        if (!canMoveNext) {
            return;
        }

        setIndex(prev => prev + 1);
    }

    const handleMovePrevFixture = () => {
        if (!canMovePrev) {
            return;
        }

        setIndex(prev => prev - 1);
    }

    return (
        <>
            <DialogModal
                open={open}
                onClose={onClose}
                title="Feature Games"
                className="flex flex-col gap-4 overflow-hidden h-full"
                hw="h-full max-h-[95vh] lg:w-1/2"
            >
                <div className="h-[85%] text-black dark:text-white overflow-y-auto flex flex-col gap-4" >
                    <div className="flex flex-row w-full items-center" >

                        <div className="flex flex-col w-1/3 items-center" >
                            <SbrTeamLogo className="h-14 w-12" teamName={currentGame.home_team} />
                            <p className="text-[12px] md:text-base" >{currentGame.home_team}</p>
                            <p>{hasScores ? currentGame.home_score : "-"}</p>
                        </div>

                        <div className="w-1/3 flex flex-col items-center justify-center" >
                            <p className="" >VS</p>
                        </div>


                        <div className="flex flex-col w-1/3 items-center" >
                            <SbrTeamLogo className="h-14 w-12" teamName={currentGame.away_team} />
                            <p className="text-[12px] md:text-base" >{currentGame.away_team}</p>
                            <p>{hasScores ? currentGame.away_score : "-"}</p>
                        </div>
                    </div>

                    <SbrFixturePredictionBox preVotingCols="one" fixture={currentGame} />
                    <SbrMotmVotingBox fixture={currentGame} />
                </div>

                <div className="h-[15%] flex flex-col gap-2 items-center " >
                    <PrimaryButton onClick={handleMoveNextFixture} disbabled={!canMoveNext} >Next Match</PrimaryButton>
                    <PrimaryButton onClick={handleMovePrevFixture} disbabled={!canMovePrev} >Previous Match</PrimaryButton>
                </div>
            </DialogModal>
        </>
    )
}