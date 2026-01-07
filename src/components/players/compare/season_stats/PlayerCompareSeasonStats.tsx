import { IProAthlete } from "../../../../types/athletes";
import { IProSeason } from "../../../../types/season";
import { PlayerSeasonStatsList } from "../../../stats/PlayerSeasonStatsList";
import RoundedCard from "../../../ui/cards/RoundedCard";

type Props = {
    season: IProSeason,
    player: IProAthlete
}

/** Renders a list of season stats for the player compare modal */
export default function PlayerCompareSeasonStatsList({season, player} : Props) {

    return (
        <PlayerSeasonStatsList.Root
            player={player}
            season={season}
        >

            <RoundedCard className='p-2 flex flex-col gap-2' >
                <div>
                    <p className='font-bold text-sm' >General</p>
                </div>

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'minutes_played_total'}
                    defaultValue={0}
                />

            </RoundedCard>

            <RoundedCard className='p-2 flex flex-col gap-2' >
                <div>
                    <p className='font-bold text-sm' >Attacking</p>
                </div>

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'tries'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'passes'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'points'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'defenders_beaten'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'turnovers_conceded'}
                    defaultValue={0}
                />
            </RoundedCard>

            <RoundedCard className='p-2 flex flex-col gap-2' >
                <div>
                    <p className='font-bold text-sm' >Ball Carrying</p>
                </div>

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'metres'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'post_contact_metres'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'carry_dominant'}
                    defaultValue={0}
                />
            </RoundedCard>

            <RoundedCard className='p-2 flex flex-col gap-2' >
                <div>
                    <p className='font-bold text-sm' >Defense</p>
                </div>

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'tackles'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'missed_tackles'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'rucks_lost'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'dominant_tackles'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'turnover_won'}
                    defaultValue={0}
                />

            </RoundedCard>


            <RoundedCard className='p-2 flex flex-col gap-2' >
                <div>
                    <p className='font-bold text-sm' >Points Kicking</p>
                </div>



                <PlayerSeasonStatsList.SpecificAction
                    actionName={'drop_goals_converted'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'conversion_goals'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'	missed_conversion_goals'}
                    defaultValue={0}
                />

            </RoundedCard>

            <RoundedCard className='p-2 flex flex-col gap-2' >
                <div>
                    <p className='font-bold text-sm' >Descipline</p>
                </div>

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'red_cards'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'yellow_cards'}
                    defaultValue={0}
                />

                <PlayerSeasonStatsList.SpecificAction
                    actionName={'penalties_conceded'}
                    defaultValue={0}
                />

            </RoundedCard>

        </PlayerSeasonStatsList.Root>
    )
}
