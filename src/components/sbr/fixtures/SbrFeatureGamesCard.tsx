import { useAtomValue } from "jotai"
import { sbrWeekFeatureGamesAtom } from "../../../state/sbrFixtures.atoms"
import SbrFixtureCard from "../SbrFixtureCard";
import { Swords } from "lucide-react";
import RoundedCard from "../../shared/RoundedCard";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

/** Renders a card of the feature games for a specific week */
export default function SbrFeatureGamesCard() {

    const featureGames = useAtomValue(sbrWeekFeatureGamesAtom);
    const isFeatureGamesEmpty = featureGames.length === 0;

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

        </RoundedCard>
    )
}
