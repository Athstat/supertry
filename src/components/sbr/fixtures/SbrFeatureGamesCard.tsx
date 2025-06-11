import { useAtomValue } from "jotai"
import { sbrWeekFeatureGamesAtom } from "../../../state/sbrFixtures.atoms"
import SbrFixtureCard from "../SbrFixtureCard";
import { Swords } from "lucide-react";
import RoundedCard from "../../shared/RoundedCard";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useState } from "react";
import { ISbrFixture } from "../../../types/sbr";
import DialogModal from "../../shared/DialogModal";
import SbrTeamLogo from "./SbrTeamLogo";
import { sbrFixtureSummary } from "../../../utils/sbrUtils";

/** Renders a card of the feature games for a specific week */
export default function SbrFeatureGamesCard() {

    const featureGames = useAtomValue(sbrWeekFeatureGamesAtom);
    const isFeatureGamesEmpty = featureGames.length === 0;

    const [show, setShow] = useState(false);
    const toggle = () => setShow(!show);

    if (isFeatureGamesEmpty) {
        return null;
    }

    return (
        <RoundedCard className="flex flex-col gap-3 p-4" >

            <div className="flex flex-row items-center gap-2" >
                <Swords />
                <h1 className="text-lg font-bold" >Feature Games</h1>
            </div>
            <p className="text-slate-300" >Predict matchups, vote for your <strong>Top Dawg Of the Game</strong> and more on this weeks feature games!</p>

            <div className="grid grid-cols-1 gap-3" >
                {featureGames.map((g, index) => {
                    return <SbrFixtureCard
                        hideVoting
                        showLogos
                        fixture={g}
                        key={index}
                    />
                })}
            </div>

            <PrimaryButton>Predict & Vote!</PrimaryButton>

            <SbrFeatureGamesModal open={true} onClose={toggle} games={featureGames} />

        </RoundedCard>
    )
}

type ModalProps = {
    games: ISbrFixture[],
    open?: boolean,
    onClose?: () => void
}

function SbrFeatureGamesModal({ games, open, onClose }: ModalProps) {

    const [index, setIndex] = useState(0);
    const currentGame = games[index];

    const {hasKickedOff, hasScores} = sbrFixtureSummary(currentGame);
    const showScores = hasScores;

    return (
        <>
            <DialogModal
                open={open}
                onClose={onClose}
                title="Feature Games"
                className="flex flex-col h-full"
                hw="h-screen lg:w-1/2"
            >
                <div className="h-[85%]" >
                    <div>
                        <div className="flex flex-row w-full items-center" >

                            <div className="flex flex-col w-1/3 items-center" >
                                <SbrTeamLogo className="h-14 w-14" teamName={currentGame.home_team} />
                                <p className="text-[15px] md:text-base" >{currentGame.home_team}</p>
                                <p>{hasScores ? currentGame.home_score : "-"}</p>
                            </div>

                            <div className="w-1/3 flex flex-col items-center justify-center" >
                                <p className="" >VS</p>
                            </div>


                            <div className="flex flex-col w-1/3 items-center" >
                                <SbrTeamLogo className="h-14 w-14" teamName={currentGame.away_team} />
                                <p className="text-[15px] md:text-base" >{currentGame.away_team}</p>
                                <p>{hasScores ? currentGame.home_score : "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[15%] flex flex-col gap-2 items-center " >
                    <PrimaryButton>Next Match</PrimaryButton>
                    <PrimaryButton>Previous Match</PrimaryButton>
                </div>
            </DialogModal>
        </>
    )
}